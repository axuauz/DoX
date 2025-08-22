
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle, CheckCircle, Pill, FileText } from "lucide-react"

interface DiagnosisResult {
  symptoms: string
  age: string
  gender: string
  matchedSymptom: string
  diagnosis: {
    diagnosis: string
    medication: string[]
    advice: string
  }
}

export default function DiagnosisForm() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    symptoms: ""
  })
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('진단 요청 중 오류 발생:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ age: "", gender: "", symptoms: "" })
    setResult(null)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            건강 진단 시작하기
          </h2>
          <p className="text-lg text-gray-600">
            몇 가지 간단한 질문으로 맞춤형 건강 조언을 받아보세요
          </p>
        </motion.div>

        {!result ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl text-center">진단 정보 입력</CardTitle>
                <CardDescription className="text-center">
                  정확한 진단을 위해 아래 정보를 입력해주세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-base font-medium">연세가 어떻게 되시나요?</Label>
                    <Select value={formData.age} onValueChange={(value) => setFormData({...formData, age: value})}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="연령대를 선택해주세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="60-65">60-65세</SelectItem>
                        <SelectItem value="66-70">66-70세</SelectItem>
                        <SelectItem value="71-75">71-75세</SelectItem>
                        <SelectItem value="76-80">76-80세</SelectItem>
                        <SelectItem value="80+">80세 이상</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-medium">성별</Label>
                    <RadioGroup 
                      value={formData.gender} 
                      onValueChange={(value) => setFormData({...formData, gender: value})}
                      className="flex space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="남성" id="male" />
                        <Label htmlFor="male" className="cursor-pointer">남성</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="여성" id="female" />
                        <Label htmlFor="female" className="cursor-pointer">여성</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="symptoms" className="text-base font-medium">어떤 증상이 있으신가요?</Label>
                    <Textarea
                      id="symptoms"
                      placeholder="예: 머리가 아파요, 기침이 나요, 배가 아파요"
                      value={formData.symptoms}
                      onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                      className="h-24 resize-none"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading || !formData.age || !formData.gender || !formData.symptoms}
                  >
                    {isLoading ? "진단 중..." : "진단받기"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <CardTitle className="text-xl text-green-600">진단 완료</CardTitle>
                </div>
                <CardDescription>
                  환자 정보: {result.age}, {result.gender} • 증상: {result.symptoms}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">진단 결과</h3>
                  <p className="text-blue-800 text-lg">{result.diagnosis.diagnosis}</p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Pill className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">권장 약물</h3>
                  </div>
                  <ul className="space-y-1">
                    {result.diagnosis.medication.map((med, index) => (
                      <li key={index} className="text-green-800 bg-green-100 px-3 py-1 rounded-full text-sm inline-block mr-2 mb-1">
                        {med}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="h-5 w-5 text-amber-600" />
                    <h3 className="font-semibold text-amber-900">건강 조언</h3>
                  </div>
                  <p className="text-amber-800">{result.diagnosis.advice}</p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <h3 className="font-semibold text-red-900">중요 안내</h3>
                  </div>
                  <p className="text-red-800 text-sm">
                    이 진단은 참고용이며, 정확한 진단과 치료를 위해서는 반드시 의료진과 상담하시기 바랍니다.
                  </p>
                </div>

                <div className="flex space-x-4">
                  <Button onClick={resetForm} variant="outline" className="flex-1">
                    다시 진단받기
                  </Button>
                  <Button variant="destructive" className="flex-1">
                    응급상황 신고
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  )
}
