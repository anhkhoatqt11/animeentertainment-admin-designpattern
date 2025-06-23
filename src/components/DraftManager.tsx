import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Input,
  Chip,
} from '@nextui-org/react';
import { AnimeFormMemento } from '@/lib/memento/AnimeFormMemento';
import { Trash2, Clock, FileText, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface DraftManagerProps {
  isOpen: boolean;
  onClose: () => void;
  drafts: Array<{ key: string; memento: AnimeFormMemento }>;
  onLoadDraft: (key: string) => void;
  onDeleteDraft: (key: string) => void;
  onSaveDraft: (name?: string) => void;
  onClearAllDrafts: () => void;
  hasUnsavedChanges: boolean;
}

export const DraftManager: React.FC<DraftManagerProps> = ({
  isOpen,
  onClose,
  drafts,
  onLoadDraft,
  onDeleteDraft,
  onSaveDraft,
  onClearAllDrafts,
  hasUnsavedChanges,
}) => {
  const [draftName, setDraftName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const formatDate = (timestamp: number) => {
    try {
      return new Date(timestamp).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const handleSaveDraft = () => {
    const key = onSaveDraft(draftName);
    setDraftName('');
    toast.success('Đã lưu bản thảo thành công');
  };

  const handleLoadDraft = (key: string) => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'Bạn có những thay đổi chưa được lưu. Bạn có chắc chắn muốn tải bản thảo này không?'
      );
      if (!confirmed) return;
    }
    onLoadDraft(key);
    onClose();
    toast.success('Đã tải bản thảo thành công');
  };

  const handleDeleteDraft = (key: string) => {
    onDeleteDraft(key);
    setShowDeleteConfirm(null);
    toast.success('Đã xóa bản thảo');
  };

  const handleClearAll = () => {
    const confirmed = window.confirm(
      'Bạn có chắc chắn muốn xóa tất cả bản thảo không? Hành động này không thể hoàn tác.'
    );
    if (confirmed) {
      onClearAllDrafts();
      toast.success('Đã xóa tất cả bản thảo');
    }
  };
  const getDraftPreview = (memento: AnimeFormMemento) => {
    try {
      const state = memento.getState();
      return {
        title: state.movieName || 'Untitled Anime',
        episodes: state.episodeList?.length || 0,
        genres: state.genreSelected?.length || 0,
        hasImages: (state.coverImage?.length || 0) > 0 || (state.landspaceImage?.length || 0) > 0,
      };
    } catch (error) {
      console.error('Error getting draft preview:', error);
      return {
        title: 'Error loading draft',
        episodes: 0,
        genres: 0,
        hasImages: false,
      };
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
        body: "py-6",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <span>Quản lý bản thảo</span>
          </div>
          {hasUnsavedChanges && (
            <Chip size="sm" color="warning" variant="flat">
              Có thay đổi chưa lưu
            </Chip>
          )}
        </ModalHeader>
        
        <ModalBody>
          {/* Save Current State */}
          <Card className="mb-4">
            <CardBody>
              <div className="flex gap-3 items-end">
                <Input
                  label="Tên bản thảo"
                  placeholder="Nhập tên bản thảo..."
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className="flex-1"
                />
                <Button
                  color="primary"
                  startContent={<Save className="w-4 h-4" />}
                  onClick={handleSaveDraft}
                >
                  Lưu bản thảo
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Drafts List */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Bản thảo đã lưu ({drafts.length})
              </h3>
              {drafts.length > 0 && (
                <Button
                  color="danger"
                  variant="light"
                  size="sm"
                  onClick={handleClearAll}
                >
                  Xóa tất cả
                </Button>
              )}
            </div>

            {drafts.length === 0 ? (
              <Card>
                <CardBody className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">Chưa có bản thảo nào được lưu</p>
                </CardBody>
              </Card>
            ) : (
              <div className="space-y-2">
                {drafts.map(({ key, memento }) => {
                  const preview = getDraftPreview(memento);
                  return (
                    <Card key={key} className="hover:shadow-md transition-shadow">
                      <CardBody className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium text-lg">
                                {preview.title}
                              </h4>
                              <div className="flex gap-2">
                                {preview.hasImages && (
                                  <Chip size="sm" color="success" variant="flat">
                                    Có ảnh
                                  </Chip>
                                )}
                                {preview.episodes > 0 && (
                                  <Chip size="sm" color="primary" variant="flat">
                                    {preview.episodes} tập
                                  </Chip>
                                )}
                                {preview.genres > 0 && (
                                  <Chip size="sm" color="secondary" variant="flat">
                                    {preview.genres} thể loại
                                  </Chip>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>{formatDate(memento.getTimestamp())}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              color="primary"
                              variant="flat"
                              size="sm"
                              onClick={() => handleLoadDraft(key)}
                            >
                              Tải
                            </Button>
                            <Button
                              color="danger"
                              variant="light"
                              size="sm"
                              isIconOnly
                              onClick={() => setShowDeleteConfirm(key)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </ModalBody>
        
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Đóng
          </Button>
        </ModalFooter>
      </ModalContent>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <Modal
          isOpen={!!showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(null)}
          size="sm"
        >
          <ModalContent>
            <ModalHeader>Xác nhận xóa</ModalHeader>
            <ModalBody>
              <p>Bạn có chắc chắn muốn xóa bản thảo này không?</p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={() => setShowDeleteConfirm(null)}
              >
                Hủy
              </Button>
              <Button
                color="danger"
                onPress={() => handleDeleteDraft(showDeleteConfirm)}
              >
                Xóa
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Modal>
  );
};
