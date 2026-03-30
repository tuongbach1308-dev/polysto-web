import Image from 'next/image'

interface SocialLink {
  id: string
  platform: string
  url: string
  icon_url?: string
}

interface Props {
  links: SocialLink[]
}

export function SocialLinks({ links }: Props) {
  if (links.length === 0) return null

  return (
    <div className="social-footer">
      <div className="social">
        {links.map(link => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={link.platform}
          >
            {link.icon_url ? (
              <Image
                src={link.icon_url}
                alt={link.platform}
                width={35}
                height={35}
                style={{ objectFit: 'contain' }}
              />
            ) : (
              <span style={{ lineHeight: '35px', fontSize: '1.4rem', color: '#fff' }}>
                {link.platform}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}
