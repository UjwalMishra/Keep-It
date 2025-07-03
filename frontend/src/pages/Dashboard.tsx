import { Button } from "../components/ui/Button";

import { AddIcon } from "../icons/AddIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Card } from "../components/ui/Card";
import { CreateContentModal } from "../components/CreateContentModal";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

export const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 relative">
      {/* Sidebar */}
      <div className="w-[240px] border-r border-gray-200 bg-white shadow-sm fixed h-full">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="ml-56 p-6">
        {/* Modal */}
        <CreateContentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Keep-It</h1>
          <div className="flex gap-4">
            <Button
              variant="primary"
              text="Add"
              size="md"
              onClick={() => setModalOpen(true)}
              startIcon={<AddIcon size="lg" />}
            />
            <Button
              variant="secondary"
              text="Share"
              size="md"
              onClick={() => {}}
              startIcon={<ShareIcon size="lg" />}
            />
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Card
            title="Raftaar"
            link="https://www.youtube.com/watch?v=XCIYHCXQoxQ&list=RDXCIYHCXQoxQ&start_radio=1"
            type="youtube"
          />
          <Card
            title="Raftaar"
            link="https://www.youtube.com/watch?v=XCIYHCXQoxQ&list=RDXCIYHCXQoxQ&start_radio=1"
            type="youtube"
          />
          <Card
            title="Raftaar"
            link="https://www.youtube.com/watch?v=XCIYHCXQoxQ&list=RDXCIYHCXQoxQ&start_radio=1"
            type="youtube"
          />
          <Card
            title="Mussu"
            link="https://x.com/smitadeshmukh/status/1940341545745723674"
            type="x"
          />
        </div>
      </div>
    </div>
  );
};
