import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import {
  useAllTagsQuery,
  useDeleteTagMutation,
  useUpdateTagMutation,
} from "redux/api/anime-info-api";
import { Dialog } from "primereact/dialog";
import { isBlank } from "utils/helpers";
import { useToast } from "utils/toast-service";
import React from "react";
import { AnimeTag } from "utils/typings";

const TagDialogItem = {
  data: { id: "", desc: "" } as AnimeTag,
  visible: false,
};
const TagList = () => {
  const { data: tagList, refetch } = useAllTagsQuery();
  const [visibleEditDialog, setVisibleEditDialog] = useState<boolean>(false);
  const [editItem, setEditItem] = useState({ id: "", desc: "" } as AnimeTag);
  const [deleteProductDialog, setDeleteProductDialog] = useState(TagDialogItem);
  const [updateTag] = useUpdateTagMutation();
  const [deleteTag] = useDeleteTagMutation();
  const showToast = useToast();

  const confirmUpdateTag = async () => {
    if (isBlank(editItem.id) || isBlank(editItem.desc)) {
      showToast("warn", "錯誤", "欄位未輸入");
      return;
    }
    await updateTag({ id: editItem.id.trim(), desc: editItem.desc.trim() });
    setVisibleEditDialog(false);
    refetch();
  };

  const confirmDeleteTag = async () => {
    await deleteTag(deleteProductDialog.data.id);
    setDeleteProductDialog(TagDialogItem);
    refetch();
  };

  return (
    <>
      <div className="card">
        <Button
          label="新增"
          icon="pi pi-plus"
          outlined
          onClick={() => {
            setEditItem(TagDialogItem.data);
            setVisibleEditDialog(true);
          }}
        ></Button>
        <DataTable value={tagList?.data} paginator rows={15}>
          <Column
            field="id"
            header="id"
            className="vertical-align-middle"
          ></Column>
          <Column
            field="desc"
            header="描述"
            className="vertical-align-middle"
          ></Column>
          <Column
            body={(rowData) => (
              <React.Fragment>
                <Button
                  icon="pi pi-pencil"
                  rounded
                  outlined
                  className="mr-2"
                  onClick={() => {
                    setVisibleEditDialog(true);
                    setEditItem(rowData);
                  }}
                />
                <Button
                  icon="pi pi-trash"
                  rounded
                  outlined
                  severity="danger"
                  onClick={() => {
                    setDeleteProductDialog({ data: rowData, visible: true });
                  }}
                />
              </React.Fragment>
            )}
          ></Column>
        </DataTable>
      </div>
      <Dialog
        header="TAG"
        visible={visibleEditDialog}
        draggable={false}
        onHide={() => setVisibleEditDialog(false)}
        footer={
          <>
            <Button
              className="mr-2"
              label="取消"
              icon="pi pi-times"
              outlined
              onClick={() => setVisibleEditDialog(false)}
            />
            <Button
              label="確定"
              icon="pi pi-check"
              onClick={() => confirmUpdateTag()}
            />
          </>
        }
      >
        <div style={{ paddingBottom: "10px" }}>
          <label className="font-bold inline-block mb-2">Id</label>
          <InputText
            className="w-full"
            value={editItem.id}
            onChange={(e) => setEditItem({ ...editItem, id: e.target.value })}
          ></InputText>
        </div>
        <div style={{ paddingBottom: "10px" }}>
          <label className="font-bold inline-block mb-2">描述</label>
          <InputText
            className="w-full"
            value={editItem.desc}
            onChange={(e) => setEditItem({ ...editItem, desc: e.target.value })}
          ></InputText>
        </div>
      </Dialog>
      <Dialog
        visible={deleteProductDialog.visible}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="確認刪除"
        modal
        footer={
          <>
            <Button
              label="取消"
              icon="pi pi-times"
              outlined
              onClick={() => setDeleteProductDialog(TagDialogItem)}
            />
            <Button
              label="確定"
              icon="pi pi-check"
              severity="danger"
              onClick={() => confirmDeleteTag()}
            />
          </>
        }
        onHide={() => setDeleteProductDialog(TagDialogItem)}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          <span>
            是否要刪除 <b>{deleteProductDialog?.data?.desc}</b> ?
          </span>
        </div>
      </Dialog>
    </>
  );
};

export default TagList;
