import numpy as np
from matplotlib import pyplot as plt

print('This code will provide you the solution to logistics equation:')
print(' ')
print('x(i+1) = G * x(i) * (1-x(i))')
print('------READ THE INSTRUCTION---------')
print('x(i)   : current popluation of any species ')
print('x(i+1) : predicted population of the species depending on growth rate')
print('G      : growth rate')

print('------- END OF INSTRUCTION -----')


n=300
x=np.zeros(n)
xtot=np.zeros(n)
#xeq=np.zeros(n)
#err=np.zeros(n)
P=P=float(input('Enter growth rate : '))
x[0]=float(input('Enter initial value (must be within 0 - 1) : '))
xtot[0]=0
i=0

err=1
while err>0:
    x[i+1]=P*x[i]*(1-x[i])
    err=abs(x[i+1]-x[i])
    if err<1e-6:
        print("Current error ", err, "is less than error limit")
        xeq=x[i+1]
        break
    elif abs(x[n-2]-x[n-3])>1e-6 :
        print("Beyond convergence limit")
        print("Current error",err,"is too high")
        break
    i +=1
if err < 1e-6 :
    print("Reached equalibrium value after",i,"step")
    print("Equlibrium value = ",xeq)   
else :
    print('******SUGGESTION::reduce growth rate value')
  
 
plt.plot(x)    
plt.xlim(0,i)
plt.ylim(0,1)
plt.show()

