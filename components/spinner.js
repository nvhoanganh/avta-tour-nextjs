import cn from 'classnames';
export default function Spinner({ color, size }) {
  return (
    <div
      className={cn('spinner inline-block align-middle mx-1 bg-white', {
        'bg-white': color === 'white',
        'bg-blue-600': color === 'blue',
      })}
      style={{
        width: size === 'sm' ? 16 : size === 'lg' ? 40 : 26,
        height: size === 'sm' ? 16 : size === 'lg' ? 40 : 26,
      }}
    />
  )
}
