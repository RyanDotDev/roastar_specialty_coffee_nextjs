import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const RelatedProducts = ({ product, relatedProducts }) => {
  return (
    <div className='related-product-list'>
      {relatedProducts
        ?.filter(({ node }) => node?.handle !== product?.handle)
        ?.slice(0, 4)
        ?.map(({ node }) => (
          <div className='related-product-card' key={node.id}>
            {/* Ensure the link is by handle */}
            <Link href={`/product/${node.handle}`}>
              {node.images.edges.length > 0 && (
                <Image 
                  src={node.images.edges[0].node.src} 
                  alt={node.title} 
                  width={200}
                  height={180}
                />
              )}
              <h3>{node.title}</h3>
            </Link>
          </div>
        ))
      }
    </div>
  )
}

export default RelatedProducts