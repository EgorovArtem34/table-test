'use server';

import Link from 'next/link';
import React from 'react';
import styles from './pagination.module.scss';

type PaginationProps = {
  page?: string;
  totalPages: number;
};

export const Pagination = (props: PaginationProps) => {
  const { page = 1, totalPages } = props;

  const currentPage = Math.min(Math.max(Number(page), 1), totalPages);

  const getPagesToShow = () => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  const pages = getPagesToShow();

  return (
    <div className={styles.container}>
      <nav
        aria-label="Пагинация"
        className={styles.navLinks}
      >
        {pages.map((p, i) => (
          <Link
            key={p}
            href={`?page=${p}`}
            className={currentPage === p ? styles['active'] : ''}
          >
            {p}
          </Link>
        ))}
      </nav>
    </div>
  );
};
