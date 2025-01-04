import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Employee } from '../model/employee';
import { EmployeeDbService } from '../employee/firestore/employee-db.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employees$ = new BehaviorSubject<readonly Employee[]>([]);
  private employeesSubscription: Subscription; 

  constructor(private employeeDbService: EmployeeDbService) {
    
    this.employeesSubscription = this.employeeDbService
      .getEmployees() 
      .subscribe({
        next: (employees) => {
          this.employees$.next(employees);
        },
        error: (error) => {
          console.error('Error fetching employees:', error);
          this.employees$.next([]); 
        },
      });
  }

  get $(): Observable<readonly Employee[]> {
    return this.employees$;
  }

  addEmployee(employee: Employee) {
    
    this.employeeDbService.createEmployee(employee);
    return true;
  }

  
  ngOnDestroy(): void {
    if (this.employeesSubscription) {
      this.employeesSubscription.unsubscribe();
    }
  }
}
