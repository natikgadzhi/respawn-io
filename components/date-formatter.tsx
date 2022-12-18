import { parseISO, format } from 'date-fns'

type Props = {
  dateString: string
}

const DateFormatter = ({ dateString }: Props) => {
  const date = parseISO(dateString)

  return <time dateTime={dateString}>
    {format(date, 'MMM do yyyy')}
  </time>
}

export default DateFormatter