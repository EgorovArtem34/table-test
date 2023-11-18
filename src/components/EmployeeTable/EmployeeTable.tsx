"use client";
import React, { useState, useEffect, useId } from "react";
import {
  Column,
  ColumnDef,
  ColumnOrderState,
  flexRender,
  getCoreRowModel,
  Header,
  Table,
  useReactTable,
} from '@tanstack/react-table'
import { useDrag, useDrop } from 'react-dnd'
import { IEmployee, IHomeProps } from "../../types/index";
import { employees } from "@/utils/employees";
import { Pagination } from "../Pagination/Pagination";
import { employeesPerPage, totalPages } from "@/utils/constants";
import "./employeeTable.scss";

const defaultColumns: ColumnDef<IEmployee>[] = [
  {
    accessorKey: 'name',
    id: 'name',
    header: 'Имя',
  },
  {
    accessorKey: 'position',
    id: 'position',
    header: 'Должность',
  },
  {
    accessorKey: 'salary',
    id: 'salary',
    header: 'Зарплата',
  },
  {
    accessorKey: 'department',
    id: 'department',
    header: 'Отдел',
  },
];

const reorderColumn = (
  draggedColumnId: string,
  targetColumnId: string,
  columnOrder: string[]
): ColumnOrderState => {
  columnOrder.splice(
    columnOrder.indexOf(targetColumnId),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string
  )
  return [...columnOrder]
}

const DraggableColumnHeader: React.FC<{
  header: Header<IEmployee, unknown>
  table: Table<IEmployee>
}> = ({ header, table }) => {
  const { getState, setColumnOrder } = table
  const { columnOrder } = getState()
  const { column } = header

  const [, dropRef] = useDrop({
    accept: 'column',
    drop: (draggedColumn: Column<IEmployee>) => {
      const newColumnOrder = reorderColumn(
        draggedColumn.id,
        column.id,
        columnOrder
      )
      setColumnOrder(newColumnOrder)
    },
  })

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => column,
    type: 'column',
  })

  return (
    <th
      ref={dropRef}
      colSpan={header.colSpan}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div ref={previewRef}>
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
        <button ref={dragRef}>🟰</button>
      </div>
    </th>
  )
}

export default function EmployeeTable(props: IHomeProps) {
  const pageNumber = Number(props?.searchParams?.page || 1);
  const startEmployeeIndex =
    (Number(pageNumber) - 1) * Number(employeesPerPage); // 0, 5, 10 ...
  const endEmployeeIndex = startEmployeeIndex + Number(employeesPerPage); // 5, 10, 15 ...

  const slicedEmployees = employees.slice(startEmployeeIndex, endEmployeeIndex);
  const [currentEmployees, setCurrentEmployees] = useState<IEmployee[]>(slicedEmployees);

  const [columns] = useState([...defaultColumns]);
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(
    columns.map(column => column.id as string)
  )

  useEffect(() => {
    setCurrentEmployees(slicedEmployees);
  }, [pageNumber]);

  const table = useReactTable({
    data: currentEmployees,
    columns,
    state: {
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  return (
    <>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <DraggableColumnHeader
                  key={header.id}
                  header={header}
                  table={table}
                />
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

      </table>
      <Pagination {...{ totalPages, ...props.searchParams }} />
    </>
  )
}
