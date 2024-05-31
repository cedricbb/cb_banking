'use client'

import CountUp from 'react-countup'

const AnimatedCounter = ({amount}: {amount: number}) => {
  return (
    <div className='w-full'>
      <CountUp 
      end={amount}
      duration={2.75}
      decimals={2}
      decimal=","
      separator=" "
      suffix=" €"
      />
    </div>
  )
}

export default AnimatedCounter