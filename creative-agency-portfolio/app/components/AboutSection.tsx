
"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Award, Shield } from "lucide-react"

const features = [
  {
    icon: Heart,
    title: "맞춤형 건강 관리",
    description: "개인의 나이, 성별, 증상을 고려한 맞춤형 건강 조언을 제공합니다."
  },
  {
    icon: Users,
    title: "노인 친화적 UI",
    description: "노인분들이 쉽게 사용할 수 있도록 설계된 직관적인 인터페이스입니다."
  },
  {
    icon: Award,
    title: "전문적인 조언",
    description: "의료 전문가들의 검증을 받은 신뢰할 수 있는 건강 정보를 제공합니다."
  },
  {
    icon: Shield,
    title: "안전한 서비스",
    description: "개인정보 보호를 최우선으로 하며, 안전한 환경에서 서비스를 이용하실 수 있습니다."
  }
]

export default function AboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            DoX가 특별한 이유
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            건강한 노후를 위한 스마트 진단 서비스로, 언제나 여러분의 곁에서 건강을 지켜드립니다.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
