import React, { useEffect, useState } from 'react'
import { bell, userLogin } from '../assets'
import { apiRequest } from '../utils/api'
import toast from 'react-hot-toast'

const RightBar: React.FC = () => {
  const [hasUnread, setHasUnread] = useState(false)

  const fetchUnreadNotifications = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const res = await apiRequest("/unread_notifications", "POST", { token })

      setHasUnread(res.total > 0)
    } catch (error: any) {
      console.error(error)
      toast.error("Failed to load notifications")
    }
  }

  useEffect(() => {
    fetchUnreadNotifications()

    // Auto-refresh every 30s
    const interval = setInterval(fetchUnreadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex gap-2 absolute right-1 justify-end items-center">
      <div className="relative">
        <img src={bell} alt="Notifications" className="w-6 h-6" />
        {hasUnread && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full"></span>
        )}
      </div>
      <img src={userLogin} alt="User" className="w-6 h-6" />
    </div>
  )
}

export default RightBar
