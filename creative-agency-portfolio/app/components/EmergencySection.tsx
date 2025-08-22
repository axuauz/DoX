
"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, AlertTriangle, Clock, MapPin } from "lucide-react"

const emergencyContacts = [
  {
    title: "응급의료센터",
    number: "119",
    description: "생명이 위험한 응급상황",
    color: "bg-red-600"
  },
  {
    title: "의료상담",
    number: "1339",
    description: "의료진 전화상담 서비스",
    color: "bg-blue-600"
  },
  {
    title: "독성정보센터",
    number: "1588-7129",
    description: "중독 응급상황",
    color: "bg-purple-600"
  }
]

export default function EmergencySection() {
  return (
    <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600 mr-2" />
            <h2 className="text-3xl font-bold text-red-600 sm:text-4xl">
              응급상황 안내
            </h2>
          </div>
          <p className="text-lg text-gray-700">
            응급상황 시 아래 번호로 즉시 연락하세요
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {emergencyContacts.map((contact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-red-200">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 ${contact.color} rounded-full flex items-center justify-center`}>
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{contact.title}</CardTitle>
                  <CardDescription>{contact.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-4">
                    {contact.number}
                  </div>
                  <Button 
                    className={`w-full ${contact.color} hover:opacity-90`}
                    onClick={() => window.location.href = `tel:${contact.number}`}
                  >
                    전화걸기
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center text-amber-800">
                <Clock className="w-5 h-5 mr-2" />
                응급상황 대처 요령
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">1. 침착함 유지</h4>
                  <p className="text-sm">당황하지 말고 침착하게 상황을 파악하세요.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2. 즉시 신고</h4>
                  <p className="text-sm">119에 전화하여 정확한 상황을 전달하세요.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3. 위치 파악</h4>
                  <p className="text-sm">정확한 주소와 주변 목표물을 알려주세요.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">4. 응급처치</h4>
                  <p className="text-sm">안전한 범위에서 기본적인 응급처치를 시행하세요.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
