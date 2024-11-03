"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { signUp, confirmSignUp } from 'aws-amplify/auth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [confirmationCode, setConfirmationCode] = React.useState('')
  const [isConfirming, setIsConfirming] = React.useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ username, password, email })
    try {
      await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email
          },
          autoSignIn: true
        }
      })
      setIsConfirming(true)
    } catch (error) {
      console.error('Error signing up:', error)
    }
  }

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await confirmSignUp({ username, confirmationCode })
      router.push('/')
    } catch (error) {
      console.error('Error confirming sign up:', error)
    }
  }

  if (isConfirming) {
    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>確認コードを入力</CardTitle>
          <CardDescription>メールに送信された確認コードを入力してください</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleConfirmSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="confirmationCode">確認コード</Label>
              <Input
                id="confirmationCode"
                type="text"
                placeholder="確認コード"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">確認</Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>新規登録</CardTitle>
        <CardDescription>お酒記録アプリに新規登録してください</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">ユーザー名</Label>
            <Input
              id="username"
              type="text"
              placeholder="ユーザー名"
              value={username}
              defaultValue="nobuhito0906"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">登録</Button>
        </form>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => router.push('/')} className="w-full">
          ログイン画面に戻る
        </Button>
      </CardFooter>
    </Card>
  )
}