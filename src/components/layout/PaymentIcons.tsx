import Image from 'next/image'

interface PaymentIcon {
  id: string
  name: string
  icon_url: string
}

interface Props {
  icons: PaymentIcon[]
}

export function PaymentIcons({ icons }: Props) {
  if (icons.length === 0) return null

  return (
    <div className="block-payment">
      {icons.map(icon => (
        <span key={icon.id} className="payment-item" title={icon.name}>
          <Image
            src={icon.icon_url}
            alt={icon.name}
            width={63}
            height={29}
            style={{ objectFit: 'contain' }}
          />
        </span>
      ))}
    </div>
  )
}
