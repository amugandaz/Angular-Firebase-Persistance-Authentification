import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  DocumentReference,
  Timestamp,
} from '@angular/fire/firestore';
import { Employee } from 'src/app/model/employee';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root',
})
export class EmployeeDbService {
  constructor(private firestore: Firestore) {}
  private employeesCollection = collection(this.firestore, 'employees'); 
  getEmployees(): Observable<Employee[]> {
    return collectionData(this.employeesCollection, {
      idField: 'id',
    }).pipe(
      map((employees: any[]) => {
   
        return employees.map((employee) => ({
          ...employee,
          dateOfBirth: (employee.dateOfBirth as Timestamp).toDate(),
        }));
      })
    ) as Observable<Employee[]>;
  }


  async createEmployee(employee: Employee): Promise<DocumentReference> {
    try {
      const employeeData = {
        ...employee,
      }; 
      const docRef = await addDoc(this.employeesCollection, employeeData);
      console.log('Employee added with ID:', docRef.id);
      return docRef;
    } catch (e) {
      console.log('There was an error adding an employee to the db.', e);
      throw e;
    }
  }
}
