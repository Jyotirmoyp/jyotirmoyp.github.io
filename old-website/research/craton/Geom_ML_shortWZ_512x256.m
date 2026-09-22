clear
addpath(genpath('/home/jyotirmoy/Desktop/code/lamem/geomio'))

% settings
inputFile              = ['ML_6_fixedslabEnd_shortWZ_noAsth.EW.svg'];
opt                    = geomIO_Options();
opt.outputDir          = ['./Output_512x256_ref_20wz'];
opt.inputFileName      = inputFile;
opt.LaMEMinputFileName = '../ncc_multigrid.dat';
opt.readLaMEM          = true;
opt.writeParaview      = true;
opt.writePolygons      = true;
opt.interp             = true;
opt.zi                 = [-100:1:100];
opt.getPolygons        = true;
%newly added to activate weak layer
opt.varySub.do         = true;
opt.varySub.vols       = {'Slab'};
opt.varySub.ref        = 'trench';
opt.varySub.xRot       = [0];
opt.varySub.theta      = [0] %[dTheta(iVersion)];
opt.varySub.tolZ       = [1];
opt.varySub.addWZ      = true;
opt.varySub.d_WZ       = 20;
opt.varySub.ID_WZ      = 13;
opt.varySub.type_WZ    = 0;
opt.varySub.d_Lith     = 250;
opt.varySub.addCrust   = false;

% Assign phases: Label, Whatever, Phase Number, just keep 0
paths = {
  %  'Mantle', 999, 1, 0
    %'Slab', 999, 9, 0
    'Air', 999, 0, 0
    'UM',999,1,0
    'LM',999,2,0
    'ContCrust', 999, 3, 0
    'Sclm', 999, 4, 0
    'Craton', 999,5, 0
    'WP1', 999, 6, 0
    'WP2',999, 7, 0
    'WP3',999, 8, 0
    'WP4',999, 9, 0
    'WP5',999, 10, 0
    'WP6',999, 11, 0
    'Slab', 999, 12, 0
  
    };

opt.pathNames       = {paths{:,1}}; 
opt.gravity.drho    = [paths{:,2}]; 
opt.phase           = [paths{:,3}];
opt.type            = [paths{:,4}];

% Run geomIO
[PathCoord,Volumes,opt] = run_geomIO(opt,'default');

%% Setup temperature
% get bounds of LaMEM box
x_box       = opt.setup.coord_x;
y_box       = opt.setup.coord_y;
z_box       = opt.setup.coord_z;

% fit marker distribution
nx          = length(opt.setup.marker_x);
ny          = length(opt.setup.marker_y);
nz          = length(opt.setup.marker_z);

% initialize matrix
T3D         = zeros(nx,ny,nz);
P3D         = zeros(nx,ny,nz);

% set up coordinate grid (for assigning specific temperatures based on coordinates)
dx          = (x_box(2)-x_box(1))/nx;
dy          = (y_box(2)-y_box(1))/ny; 
dz          = (z_box(2)-z_box(1))/nz;
x_vec       = (x_box(1)+dx/2:dx:x_box(2)-dx/2);
y_vec       = (y_box(1)+dy/2:dy:y_box(2)-dy/2);
z_vec       = (z_box(1)+dz/2:dz:z_box(2)-dz/2);

% DO NOT USE MESHGRID HERE!
[X,Y,Z] = ndgrid(x_vec,y_vec,z_vec);

%% setup background T-profile
z_surf      = 0;
z_Moho     = -40;
z_LAB       = -100;
z_crat      = -200;
T_surf      = 0;
T_Moho     = 800;
T_LAB       = 1200;
T_crat      = 1000;
T_bot       = 1600;
Age_plate   = 30; %[Ma]

grad_lith  = (T_LAB - T_surf) / z_LAB;
grad_crat     = (T_crat - T_Moho)  / (z_crat - z_Moho);
grad_mantle = (T_bot - T_LAB)   / (opt.setup.z_bot - z_LAB);


% 1D features
T_vec       = zeros(nz,1);
% air
ind         = find(z_vec >= z_surf);
T_vec(ind)  = T_surf;
% lithosphere
ind         = find(z_vec < z_surf & z_vec >= z_LAB);
T_vec(ind)  = T_surf + (z_vec(ind)-z_surf) * grad_lith;
% mantle
ind         = find(z_vec < z_LAB);
T_vec(ind)  = T_LAB  + (z_vec(ind)-z_LAB)  * grad_mantle;
for i = 1 : nz
    T3D(:,:,i) = T_vec(i);
end

% 2D features
% craton
ind_c         = find(Z < z_Moho & Z >= z_crat & X > -1800 & X < 400);
%T3D(ind_c)    = T_LAB + (Z(ind_c)-z_LAB) * grad_crat;
%T3D(ind_c)    = T_LAB - 200;
T3D(ind_c)    = T_Moho + (Z(ind_c)-z_Moho) * grad_crat;
%% identify slab markers
Vol = Volumes.Slab;

for i = 1 : length(Vol.PolyPos)
    j           = Vol.PolyPos(i);
    Poly        = Vol.Polygons{i};
    Markers.x   = squeeze(X(:,:,j));
    Markers.y   = squeeze(Y(:,:,j));
    
    In          = inpolygon(Markers.x, Markers.y, Poly(:,1), Poly(:,2));
    
    P3D(:,:,j)  = In;
end
indSlab = find(P3D == 1);

%% find coordinates of slab top
SlabTop = zeros(nx*ny,3);
iter    = 1;
for i = 1 : nx
    for j = 1 : ny
        col = squeeze(P3D(i,j,:));
        ind = find(col == 1,1,'last');
        if ~isempty(ind)
            SlabTop(iter,:) = [X(i,j,ind),Y(i,j,ind),Z(i,j,ind)];
            iter = iter + 1;
        end
    end
end
SlabTop = SlabTop(1:iter-1,:);

%% loop over all markers
Kappa = 1e-6;
Age   = Age_plate * 1e6 * 365.25 * 24 * 3600;
TwoSqrtKappaAge = 2*sqrt(Kappa*Age);
for i = 1 : nx
    for j = 1 : ny
        for k = 1 : nz
            if P3D(i,j,k) == 1
                coord   = [X(i,j,k),Y(i,j,k),Z(i,j,k)];
                allDist = ((coord(1) - SlabTop(:,1)).^2 + (coord(2) - SlabTop(:,2)).^2 + (coord(3) - SlabTop(:,3)).^2).^(1/2);
                minDist = min(allDist)*1000;
                T3D(i,j,k) = T_LAB*erf(minDist/TwoSqrtKappaAge);
            end
        end
    end
end


%% write binary to be read by LaMEM
%(Filename,[# of points in x-dir, # of points in y-dir, # of points in z-dir, Temp-Matrix in vector form])
petscBinaryWrite('Temp_ref_20wz.dat',[nx;ny;nz;T3D(:)]);