import { IHomeProps } from '@/types'
import { PageProps } from '../../.next/types/app/layout'
import styles from './page.module.css'
import EmployeeTable from '@/components/EmployeeTable/EmployeeTable'

export default function Home(props: IHomeProps) {
  return (
    <main className={styles.main}>
      <EmployeeTable {...props} />
    </main>
  )
}
