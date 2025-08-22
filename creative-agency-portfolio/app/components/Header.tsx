"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Heart, Phone } from "lucide-react"

export default function Header() {
  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">DoX</span>
          </motion.div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            홈
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            소개
          </Link>
          <Link href="/emergency" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            응급상황
          </Link>
        </nav>

        <motion.div
          className="flex items-center space-x-2 text-sm text-gray-600"
          whileHover={{ scale: 1.05 }}
        >
          <Phone className="h-4 w-4" />
          <span>119</span>
        </motion.div>
      </div>
    </motion.header>
  )
}