[Home](https://jyotirmoyp.github.io)
    





<!--naviation menu ends-->

```py
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Sep  4 15:38:46 2023

@author: jyotirmoy
"""

#%% Iterative solver
import numpy as np
import copy 
import matplotlib.pyplot as plt

xlen=1
n=4
x=np.linspace(0,xlen,n+1)
dx=(x[1]-x[0])
phi=np.zeros(n+1)
phinew=np.zeros(n+1)
phi[0]=0
phi[n]=0

iter=0
error=1
tol=1e-6
while error > tol:
    phinew = copy.deepcopy(phi)
    for i in range (1,n):
        phi[i] = 0.5*(phinew[i+1] + phinew[i-1] -(dx)**2)
        iter=iter+1
    error = np.sum(abs(phi - phinew))
        
plt.plot(x,phi)    


#%% Direct solver 


import numpy as np 
import numpy.linalg as linalg

xlen=1
n=4

x = np.linspace(0, xlen, n + 1)
dx = x[1] - x[0]

L = np.zeros((n + 1, n + 1), dtype='float')
R = np.zeros((n + 1, 1), dtype = 'float')
S = np.zeros((n + 1, 1), dtype = 'float')

L[0, 0] = 1
L[n, n] = 1
R[0, 0] = 0
R[n, 0] = 0


for i in range(1,n):
    L[i, i - 1] = 1 / dx ** 2
    L[i, i]     = - 2 / dx ** 2
    L[i, i + 1] = 1 / dx ** 2
    R[i, 0]    = 1
    
S = linalg.solve(L, R)    

plt.plot(x,S)

        

```
