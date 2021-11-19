import { format } from 'date-fns'

export default function DateWithTimeComponent({ dateString }) {
  return (
    <time dateTime={dateString}>
      {format(new Date(dateString), 'LLLL	d, yyyy HH:mm')}
    </time>
  )
}
