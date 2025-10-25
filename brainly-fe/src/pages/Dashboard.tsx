import { useEffect, useState } from "react"
import { Button } from "../components/Button"
import { Card } from "../components/Card"
import { CreateContentModal } from "../components/CreateContentModel"
import { PlusIcon } from "../icons/PlusIcon"
import { ShareIcon } from "../icons/ShareIcon"
import { Sidebar } from "../components/Sidebar"
import { useContent } from "../hooks/useContent"
import { BACKEND_URL } from "../config"
import axios from "axios"

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const {contents, refresh} = useContent();

  useEffect(() => {
    refresh();
  }, [modalOpen])

  return <div>
    <Sidebar />
    <div className="ml-72 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-gray-900">Your Brain Collection</h1>
        <p className="text-gray-600 mt-1">Organize your favorite content</p>
      </div>
      
      <div className="p-4">
        <CreateContentModal open={modalOpen} onClose={() => {
          setModalOpen(false);
        }} />
        <div className="flex justify-end gap-4 mb-6">
          <Button onClick={() => {
            setModalOpen(true)
          }} variant="primary" text="Add content" startIcon={<PlusIcon />}></Button>
          <Button onClick={async () => {
              const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, {
                  share: true
              }, {
                  headers: {
                      "Authorization": localStorage.getItem("token")
                  }
              });
              const shareUrl = `http://localhost:5173/share/${response.data.hash}`;
              alert(shareUrl);
          }} variant="secondary" text="Share brain" startIcon={<ShareIcon />}></Button>
        </div>

        {/* Pinterest-style Grid */}
        <div className="pinterest-grid">
          {contents.map((content: any, index: number) => (
            <div key={content._id || index} className="pinterest-card">
              <Card
                title={content.title}
                link={content.link}
                type={content.type}
              />
            </div>
          ))}
          
          {/* Empty state */}
          {contents.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🧠</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your brain is empty</h3>
              <p className="text-gray-500 text-center">Start adding content to build your knowledge collection</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
}
