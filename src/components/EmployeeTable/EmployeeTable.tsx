"use client";
import React, { useState, useEffect, useId } from "react";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IEmployee, IHomeProps } from "../../types/index";
import { employees } from "@/utils/employees";
import { Pagination } from "../Pagination/Pagination";
import { employeesPerPage, totalPages } from "@/utils/constants";
import "./employeeTable.scss";

const SortableEmployee = ({ employee }: { employee: IEmployee }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: employee.id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <td>{employee.name}</td>
      <td>{employee.position}</td>
      <td>{employee.salary}</td>
      <td>{employee.department}</td>
    </tr>
  );
};

export default function EmployeeTable(props: IHomeProps) {
  const pageNumber = Number(props?.searchParams?.page || 1);

  const startEmployeeIndex =
    (Number(pageNumber) - 1) * Number(employeesPerPage); // 0, 5, 10 ...
  const endEmployeeIndex = startEmployeeIndex + Number(employeesPerPage); // 5, 10, 15 ...

  const slicedEmployees = employees.slice(startEmployeeIndex, endEmployeeIndex);
  const [currentEmployees, setCurrentEmployees] = useState(slicedEmployees);
  const uniqueId = useId();

  useEffect(() => {
    setCurrentEmployees(slicedEmployees);
  }, [pageNumber]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id === over.id) return;
    setCurrentEmployees((employees) => {
      const oldIndex = employees.findIndex(
        (employee) => employee.id === active.id
      );
      const newIndex = employees.findIndex(
        (employee) => employee.id === over.id
      );
      return arrayMove(employees, oldIndex, newIndex);
    });
  };

  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        id={uniqueId}
      >
        <table>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Должность</th>
              <th>Стаж работы</th>
              <th>Отдел</th>
            </tr>
          </thead>
          <SortableContext
            items={currentEmployees}
            strategy={verticalListSortingStrategy}
          >
            <tbody>
              {currentEmployees?.map((currentEmployee, index) => (
                <SortableEmployee
                  key={currentEmployee.id}
                  employee={currentEmployee}
                />
              ))}
            </tbody>
          </SortableContext>
        </table>
      </DndContext>

      <Pagination {...{ totalPages, ...props.searchParams }} />
    </>
  );
}
