import Image from 'next/image'

const contentfulLoader = ({ src, width, quality }) => {
  return `${src}`
}

const FirebaseImage = (props) => {
  return <Image loader={contentfulLoader} {...props} unoptimized={true} />
}

export default FirebaseImage
