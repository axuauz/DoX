"use client"

import { motion } from "framer-motion"
import { Heart, Shield, Clock } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              <span className="text-blue-600">건강한 노후</span>를 위한
              <br />
              스마트 진단 서비스
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              간단한 질문으로 맞춤형 건강 조언을 받아보세요.
              <br />
              언제나 여러분의 건강을 생각합니다.
            </p>
          </motion.div>

          <motion.div
            className="mt-10 flex justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                <Heart className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-gray-700">맞춤 진단</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">
                <Shield className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-gray-700">안전한 서비스</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white">
                <Clock className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-gray-700">24시간 이용</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}