import React from 'react'
import Avatar from 'react-avatar'

interface props {
  username: string;
}


const ClientComponent = ({username} : props) => {
  return (
    <div className='flex gap-4 items-center'>
      <Avatar name={username} size="50" round='14px' />
      <p className="text-white font-medium text-start">{username}</p>
    </div>
  )
}

export default ClientComponent
