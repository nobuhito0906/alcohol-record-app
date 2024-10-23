"use client"
import React, { useState, useEffect } from 'react'
import { Amplify } from 'aws-amplify'
import { fetchAuthSession, signOut } from 'aws-amplify/auth'
import { generateClient } from 'aws-amplify/api'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

// AWS Amplify設定
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'YOUR_USER_POOL_ID',
      userPoolClientId: 'YOUR_CLIENT_ID',
    }
  },
  API: {
    REST: {
      alcoholAPI: {
        endpoint: 'YOUR_API_GATEWAY_ENDPOINT',
        region: 'YOUR_REGION'
      }
    }
  }
});

const client: any = generateClient()
interface RecordToUpdate {
  id: string
  rating: string
  name: string
  // other properties...
}



function App() {
  const [records, setRecords] = useState<Record<string, any>[]>([]);
  const [searchParams, setSearchParams] = useState({
    date: '',
    category: '',
    name: '',
    rating: '',
  })
  const [newRecord, setNewRecord] = useState({
    rating: '',
    name: '',
    category: '',
    comment: '',
  })
  const [selectedRecords, setSelectedRecords] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isUpdatePopoverOpen, setIsUpdatePopoverOpen] = useState(false)
  const [recordToUpdate, setRecordToUpdate] = useState<Record<string, any>>({ id: '', rating: '', name: '', category: '', comment: '' });
  // const recordToUpdate: Record<string, any> = { id: '', rating: '', name: '', category: '', comment: '' };
  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      const session = await fetchAuthSession()
      if (session && session.tokens) {
        const token = session.tokens.accessToken.toString()
        const response = await client.get({
          apiname: 'alcoholAPI',
          path: '/records', 
          headers: {
            Authorization: `Bearer ${token}`,
          },
          queryStringParameters: searchParams,
        })
        setRecords(response.data)        
    } else {
      console.error('No session or tokens found')
    }
    } catch (error) {
      console.error('Error fetching records:', error)
    }
  }

  const handleSearch = () => {
    fetchRecords()
  }

  const handleCreate = async () => {
    try {
      const session = await fetchAuthSession()
      if (session && session.tokens) {
        const token = session.tokens.accessToken.toString()
        await client.invoke('alcoholAPI', '/records', {
          body: newRecord,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: 'post',
        })
        await fetchRecords()
        setNewRecord({ rating: '', name: '', category: '', comment: '' })
    } else {
      console.error('No session or tokens found')
    }
    } catch (error) {
      console.error('Error creating record:', error)
    }
  }

  const handleUpdate = async () => {
    try {
      const session = await fetchAuthSession()
      if (session && session.tokens && recordToUpdate) {
      const token = session.tokens.accessToken.toString()
      await client.put('alcoholAPI', `/records/${recordToUpdate.id}`, {
        body: recordToUpdate,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      await fetchRecords()
        setIsUpdatePopoverOpen(false)
      } else {
        console.error('No session or tokens found')
      }
    } catch (error) {
      console.error('Error updating record:', error)
    }
  }

  const handleDelete = async () => {
    try {
      const session = await fetchAuthSession()
      if (session && session.tokens && recordToUpdate) {
      const token = session.tokens.accessToken.toString()
      for (const id of selectedRecords) {
        await client.del('alcoholAPI', `/records/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
      await fetchRecords()
      setSelectedRecords([])
        setIsDeleteDialogOpen(false)
      } else {
        console.error('No session or tokens found')
      }
    } catch (error) {
      console.error('Error deleting records:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">お酒記録アプリ</h1>
      <Button onClick={handleSignOut} className="mb-4">サインアウト</Button>

      {/* 検索フォーム */}
      <div className="mb-4 grid grid-cols-4 gap-4">
        <Input
          placeholder="日付"
          value={searchParams.date}
          onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
        />
        <Input
          placeholder="カテゴリ"
          value={searchParams.category}
          onChange={(e) => setSearchParams({ ...searchParams, category: e.target.value })}
        />
        <Input
          placeholder="名前"
          value={searchParams.name}
          onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
        />
        <Input
          placeholder="評価"
          value={searchParams.rating}
          onChange={(e) => setSearchParams({ ...searchParams, rating: e.target.value })}
        />
      </div>
      <Button onClick={handleSearch}>検索</Button>

      {/* 登録フォーム */}
      <div className="mt-8 mb-4 grid grid-cols-4 gap-4">
        <Input
          placeholder="評価"
          value={newRecord.rating}
          onChange={(e) => setNewRecord({ ...newRecord, rating: e.target.value })}
        />
        <Input
          placeholder="名前"
          value={newRecord.name}
          onChange={(e) => setNewRecord({ ...newRecord, name: e.target.value })}
        />
        <Select
          value={newRecord.category}
          onValueChange={(value) => setNewRecord({ ...newRecord, category: value })}>
          <option value="">カテゴリを選択</option>
          <option value="whisky">ウイスキー</option>
          <option value="sake">日本酒</option>
          <option value="wine">ワイン</option>
          <option value="beer">ビール</option>
        </Select>
        <Input
          placeholder="感想"
          value={newRecord.comment}
          onChange={(e) => setNewRecord({ ...newRecord, comment: e.target.value })}
        />
      </div>
      <Button onClick={handleCreate}>登録</Button>

      {/* 検索結果一覧 */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">検索結果</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th>選択</th>
              <th>評価</th>
              <th>名前</th>
              <th>カテゴリ</th>
              <th>登録日</th>
              <th>更新日</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>
                  <Checkbox
                    checked={selectedRecords.includes(record.id)}
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      if (target.checked) {
                        setSelectedRecords([...selectedRecords, record.id])
                      } else {
                        setSelectedRecords(selectedRecords.filter((id) => id !== record.id))
                      }
                    }}
                  />
                </td>
                <td>{record.rating}</td>
                <td>{record.name}</td>
                <td>{record.category}</td>
                <td>{record.createdAt}</td>
                <td>{record.updatedAt}</td>
                <td>
                  <Popover
                    open={isUpdatePopoverOpen && recordToUpdate?.id === record.id}
                    onOpenChange={(open) => {
                      setIsUpdatePopoverOpen(open)
                      if (open) {
                        setRecordToUpdate(record as RecordToUpdate)
                      }
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button>更新</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="grid gap-4">
                        <Input
                          placeholder="評価"
                          value={recordToUpdate?.rating || ''}
                          onChange={(e) =>
                            setRecordToUpdate({ ...recordToUpdate, rating: e.target.value })
                          }
                        />
                        <Input
                          placeholder="名前"
                          value={recordToUpdate?.name || ''}
                          onChange={(e) =>
                            setRecordToUpdate({ ...recordToUpdate, name: e.target.value })
                          }
                        />
                        <Input
                          placeholder="感想"
                          value={recordToUpdate?.comment || ''}
                          onChange={(e) =>
                            setRecordToUpdate({ ...recordToUpdate, comment: e.target.value })
                          }
                        />
                        <Button onClick={handleUpdate}>更新</Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 削除ボタン */}
      <div className="mt-4 text-right">
        <Button onClick={() => setIsDeleteDialogOpen(true)} disabled={selectedRecords.length === 0}>
          削除
        </Button>
      </div>

      {/* 削除確認ダイアログ */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確認</DialogTitle>
            <DialogDescription>
              選択したデータを削除します。よろしいですか？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleDelete}>削除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default withAuthenticator(App)