import ContentfulImage from './contentful-image'

export default function Avatar({ name, picture }) {
  return (
    <div className="flex items-center">
      <div className="relative w-12 h-12 mr-4">
        {
          picture.url
            ? <ContentfulImage
              src={picture.url}
              layout="fill"
              className="rounded-full"
              alt={name}
            />
            : <span className="inline-flex items-center justify-center h-28 w-28 rounded-full bg-gray-400">
              <span className="text-xl font-medium leading-none text-white">{name.split(" ").map((n) => n[0]).join("")}</span>
            </span>
        }
      </div>
      <div className="text-xl font-bold">{name}</div>
    </div>
  )
}
