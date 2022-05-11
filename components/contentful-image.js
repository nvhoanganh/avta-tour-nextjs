import Image from 'next/image'

const contentfulLoader = ({ src, width, quality }) => {
  if (src.indexOf('firebasestorage.googleapis.com') >= 0) {
    return `${src}&width=${width}`
  } else {
    return `${src}?w=${width}&q=${quality || 75}`
  }
}

const ContentfulImage = (props) => {
  return <Image loader={contentfulLoader} {...props} />
}

export default ContentfulImage
