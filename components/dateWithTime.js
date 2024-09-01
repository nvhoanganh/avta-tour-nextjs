import { format } from 'date-fns'

export default function DateWithTimeComponent({ dateString }) {
  return (
    <time dateTime={dateString}>
      {format(new Date(dateString), 'E, LLL	d, h:mmaaa')}
    </time>
  )
}
