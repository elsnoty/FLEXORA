'use client'

import { useState } from 'react'
import { deleteUserAction } from './deleteUser';


export default function DeleteUserButton({ userId }: { userId: string }) {
  const [message, setMessage] = useState("")

  async function handleDelete() {
    const res = await deleteUserAction(userId)
    setMessage(res.error ?? res.success ?? "Unknown error occurred");
  }

  return (
    <div>
      <button onClick={handleDelete} className="bg-red-500 text-white p-2">Delete User</button>
      {message && <p>{message}</p>}
    </div>
  )
}


