'use client'
import { signOut } from 'next-auth/react'
import React from 'react'

function Users() {
  return (
    <button onClick={()=>signOut()}>
      Logout
    </button>
  )
}

export default Users
