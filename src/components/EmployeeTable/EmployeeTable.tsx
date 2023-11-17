'use server'
import React from 'react';
import { IHomeProps } from "../../types/index";
import './employeeTable.scss';
import { employees } from '@/utils/employees';
import { Pagination } from '../Pagination/Pagination';
import { employeesPerPage, totalPages } from '@/utils/constants';

export default async function EmployeeTable(props: IHomeProps) {
  const pageNumber = Number(props?.searchParams?.page || 1);

  const startEmployeeIndex = (Number(pageNumber) - 1) * Number(employeesPerPage) // 0, 5, 10 ...
  const endEmployeeIndex = startEmployeeIndex + Number(employeesPerPage) // 5, 10, 15 ...

  const currentEmployees = employees.slice(startEmployeeIndex, endEmployeeIndex);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Должность</th>
            <th>Стаж работы</th>
            <th>Отдел</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.map((currentEmployee, index) => (
            <tr key={index}>
              <td>{currentEmployee.name}</td>
              <td>{currentEmployee.position}</td>
              <td>{currentEmployee.salary}</td>
              <td>{currentEmployee.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination {...{ totalPages, ...props.searchParams }} />
    </>
  )
}
