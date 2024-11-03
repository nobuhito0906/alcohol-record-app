// "use client"

// import React, { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { fetchAuthSession } from 'aws-amplify/auth'
// import { generateClient, GetRequest, PostRequest, PutRequest, DeleteRequest } from 'aws-amplify/api'
// import { withAuthenticator } from '@aws-amplify/ui-react'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"
// import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// const client = generateClient()

// interface Record {
//   id: string
//   rating: string
//   name: string
//   category: string
//   comment: string
//   createdAt: string
//   updatedAt: string
// }

// function SearchPage({ signOut, user }: { signOut: () => void, user: any }) {
//   const [records, setRecords] = useState<Record[]>([])
//   const [searchParams, setSearchParams] = useState({
//     date: '',
//     category: '',
//     name: '',
//     rating: '',
//   })
//   const [newRecord, setNewRecord] = useState({
//     rating: '',
//     name: '',
//     category: '',
//     comment: '',
//   })
//   const [selectedRecords, setSelectedRecords] = useState<string[]>([])
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
//   const [isUpdatePopoverOpen, setIsUpdatePopoverOpen] = useState(false)
//   const [recordToUpdate, setRecordToUpdate] = useState<Record | null>(null)
//   const router = useRouter()

//   useEffect(() => {
//     fetchRecords()
//   }, [])

//   const fetchRecords = async () => {
//     try {
//       const session = await fetchAuthSession()
//       if (session && session.tokens) {
//         const token = session.tokens.accessToken.toString()
//         const response = await client.send(new GetRequest({
//           apiName: 'alcoholAPI',
//           path: '/records',
//           options: {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//             queryParams: searchParams,
//           },
//         }))
//         setRecords(response.data)        
//       } else {
//         console.error('No session or tokens found')
//         router.push('/')
//       }
//     } catch (error) {
//       console.error('Error fetching records:', error)
//       router.push('/')
//     }
//   }

//   const handleSearch = () => {
//     fetchRecords()
//   }

//   const handleCreate = async () => {
//     try {
//       const session = await fetchAuthSession()
//       if (session && session.tokens) {
//         const token = session.tokens.accessToken.toString()
//         const response = await client.send(
//           new PostRequest({
//             apiName: 'alcoholAPI',
//             path: '/records',
//             options: {
//               body: newRecord,
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             },
//           })
//         )
//         await fetchRecords()
//         setNewRecord({ rating: '', name: '', category: '', comment: '' })
//       } else {
//         console.error('No session or tokens found')
//         router.push('/')
//       }
//     } catch (error) {
//       console.error('Error creating record:', error)
//     }
//   }

//   const handleUpdate = async () => {
//     try {
//       const session = await fetchAuthSession()
//       if (session && session.tokens && recordToUpdate) {
//         const token = session.tokens.accessToken.toString()
//         await client.send(new PutRequest({
//           apiName: 'alcoholAPI',
//           path: `/records/${recordToUpdate.id}`,
//           options: {
//             body: recordToUpdate,
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           },
//         }))
//         await fetchRecords()
//         setIsUpdatePopoverOpen(false)
//       } else {
//         console.error('No session or tokens found')
//         router.push('/')
//       }
//     } catch (error) {
//       console.error('Error updating record:', error)
//     }
//   }

//   const handleDelete = async () => {
//     try {
//       const session = await fetchAuthSession()
//       if (session && session.tokens) {
//         const token = session.tokens.accessToken.toString()
//         for (const id of selectedRecords) {
//           await client.send(new DeleteRequest({
//             apiName: 'alcoholAPI',
//             path: `/records/${id}`,
//             options: {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             },
//           }))
//         }
//         await fetchRecords()
//         setSelectedRecords([])
//         setIsDeleteDialogOpen(false)
//       } else {
//         console.error('No session or tokens found')
//         router.push('/')
//       }
//     } catch (error) {
//       console.error('Error deleting records:', error)
//     }
//   }

//   return (
//     <div className="w-full max-w-4xl space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>お酒記録アプリ</CardTitle>
//           <CardDescription>ようこそ、{user.username}さん！</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="search-date">日付</Label>
//                 <Input
//                   id="search-date"
//                   placeholder="日付"
//                   value={searchParams.date}
//                   onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="search-category">カテゴリ</Label>
//                 <Input
//                   id="search-category"
//                   placeholder="カテゴリ"
//                   value={searchParams.category}
//                   onChange={(e) => setSearchParams({ ...searchParams, category: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="search-name">名前</Label>
//                 <Input
//                   id="search-name"
//                   placeholder="名前"
//                   value={searchParams.name}
//                   onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="search-rating">評価</Label>
//                 <Input
//                   id="search-rating"
//                   placeholder="評価"
//                   value={searchParams.rating}
//                   onChange={(e) => setSearchParams({ ...searchParams, rating: e.target.value })}
//                 />
//               </div>
//             </div>
//             <Button onClick={handleSearch}>検索</Button>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>新規登録</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="new-rating">評価</Label>
//               <Input
//                 id="new-rating"
//                 placeholder="評価"
//                 value={newRecord.rating}
//                 onChange={(e) => setNewRecord({ ...newRecord, rating: e.target.value })}
//               />
//             </div>
//             <div>
//               <Label htmlFor="new-name">名前</Label>
//               <Input
//                 id="new-name"
//                 placeholder="名前"
//                 value={newRecord.name}
//                 onChange={(e) => setNewRecord({ ...newRecord, name: e.target.value })}
//               />
//             </div>
//             <div>
//               <Label htmlFor="new-category">カテゴリ</Label>
//               <Select
//                 value={newRecord.category}
//                 onValueChange={(value) => setNewRecord({ ...newRecord, category: value })}
//               >
//                 <SelectTrigger id="new-category">
//                   <SelectValue placeholder="カテゴリを選択" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="whisky">ウイスキー</SelectItem>
//                   <SelectItem value="sake">日本酒</SelectItem>
//                   <SelectItem value="wine">ワイン</SelectItem>
//                   <SelectItem value="beer">ビール</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label htmlFor="new-comment">感想</Label>
//               <Input
//                 id="new-comment"
//                 placeholder="感想"
//                 value={newRecord.comment}
//                 onChange={(e) => setNewRecord({ ...newRecord, comment: e.target.value })}
//               />
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter>
//           <Button onClick={handleCreate}>登録</Button>
//         </CardFooter>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>検索結果</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="w-[50px]">選択</TableHead>
//                 <TableHead>評価</TableHead>
//                 <TableHead>名前</TableHead>
//                 <TableHead>カテゴリ</TableHead>
//                 <TableHead>登録日</TableHead>
//                 <TableHead>更新日</TableHead>
//                 <TableHead className="text-right">操作</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {records.map((record) => (
//                 <TableRow key={record.id}>
//                   <TableCell>
//                     <Checkbox
//                       checked={selectedRecords.includes(record.id)}
//                       onCheckedChange={(checked) => {
//                         if (checked) {
//                           setSelectedRecords([...selectedRecords, record.id])
//                         } else {
//                           setSelectedRecords(selectedRecords.filter((id) => id !== record.id))
//                         }
//                       }}
//                     />
//                   </TableCell>
//                   <TableCell>{record.rating}</TableCell>
//                   <TableCell>{record.name}</TableCell>
//                   <TableCell>{record.category}</TableCell>
//                   <TableCell>{record.createdAt}</TableCell>
//                   <TableCell>{record.updatedAt}</TableCell>
//                   <TableCell className="text-right">
//                     <Popover
//                       open={isUpdatePopoverOpen && recordToUpdate?.id === record.id}
//                       onOpenChange={(open) => {
//                         setIsUpdatePopoverOpen(open)
//                         if (open) {
//                           setRecordToUpdate(record)
//                         }
//                       }}
//                     >
//                       <PopoverTrigger asChild>
//                         <Button variant="outline">更新</Button>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-80">
//                         <div className="grid gap-4">
//                           <div className="space-y-2">
//                             <h4 className="font-medium  leading-none">レコードの更新</h4>
//                             <p className="text-sm text-muted-foreground">
//                               レコードの詳細を更新します。
//                             </p>
//                           </div>
//                           <div className="grid gap-2">
//                             <div className="grid grid-cols-3 items-center gap-4">
//                               <Label htmlFor="update-rating">評価</Label>
//                               <Input
//                                 id="update-rating"
//                                 className="col-span-2 h-8"
//                                 value={recordToUpdate?.rating || ''}
//                                 onChange={(e) =>
//                                   setRecordToUpdate(recordToUpdate ? { ...recordToUpdate, rating: e.target.value } : null)
//                                 }
//                               />
//                             </div>
//                             <div className="grid grid-cols-3 items-center gap-4">
//                               <Label htmlFor="update-name">名前</Label>
//                               <Input
//                                 id="update-name"
//                                 className="col-span-2 h-8"
//                                 value={recordToUpdate?.name || ''}
//                                 onChange={(e) =>
//                                   setRecordToUpdate(recordToUpdate ? { ...recordToUpdate, name: e.target.value } : null)
//                                 }
//                               />
//                             </div>
//                             <div className="grid grid-cols-3 items-center gap-4">
//                               <Label htmlFor="update-comment">感想</Label>
//                               <Input
//                                 id="update-comment"
//                                 className="col-span-2 h-8"
//                                 value={recordToUpdate?.comment || ''}
//                                 onChange={(e) =>
//                                   setRecordToUpdate(recordToUpdate ? { ...recordToUpdate, comment: e.target.value } : null)
//                                 }
//                               />
//                             </div>
//                           </div>
//                           <Button onClick={handleUpdate}>更新</Button>
//                         </div>
//                       </PopoverContent>
//                     </Popover>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//         <CardFooter className="flex justify-between">
//           <Button variant="outline" onClick={signOut}>サインアウト</Button>
//           <Button onClick={() => setIsDeleteDialogOpen(true)} disabled={selectedRecords.length === 0}>
//             削除
//           </Button>
//         </CardFooter>
//       </Card>

//       <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>確認</DialogTitle>
//             <DialogDescription>
//               選択したデータを削除します。よろしいですか？
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
//               キャンセル
//             </Button>
//             <Button onClick={handleDelete}>削除</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

// export default withAuthenticator(SearchPage)