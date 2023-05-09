import { InputText } from "primereact/inputtext";
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { Editor } from "primereact/editor";
import {
  InputNumber,
  InputNumberChangeEvent,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { Chips } from "primereact/chips";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { AnimeInfo, Result } from "../../utils/typings";
import {
  useSearchAnimeInfoMutation,
  useUpdateAnimeInfoMutation,
} from "../../redux/api/anime-info-api";
import moment from "moment";
import { get, isBlank, isNumeric, replace } from "../../utils/helpers";
import { Toast } from "primereact/toast";
import ReactQuill from "react-quill";

const Card = styled.div`
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  padding: 2rem;
  padding-top: 2rem;
  padding-right: 2rem;
  padding-bottom: 2rem;
  padding-left: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--card-shadow);
  border-radius: 12px;
`;
const Label = styled.label`
  color: var(--surface-600);
  font-weight: 700;
  font-size: 0.875rem;
  display: block;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

const AnimeEdit = () => {
  const [name, setName] = useState("");

  const [officialName, setOfficialName] = useState("");
  const [chineseName, setChineseName] = useState("");
  const [author, setAuthor] = useState([] as string[]);
  const [studio, setStudio] = useState([] as string[]);
  const [date, setDate] = useState(undefined as Date[] | undefined);
  const [category, setCategory] = useState([] as string[]);
  const [episode, setEpisode] = useState(1);
  const [wikiUrl, setWikiUrl] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [outline, setOutline] = useState("");

  // const [values, setValues] = useState(initialValues);
  const [updateAnimeInfo] = useUpdateAnimeInfoMutation();
  const [searchAnimeInfo, searchResult] = useSearchAnimeInfoMutation();
  const toast = useRef<Toast>(null);

  const search = async () => {
    if (isBlank(name)) {
      return toast.current?.show({
        severity: "warn",
        detail: "輸入名稱後搜尋",
      });
    }
    console.log(name);
    const res = await searchAnimeInfo({ name });
    const result: Result<AnimeInfo> | undefined = get(res, "data");
    if (result && result.type === "S") {
      const data = result.data;
      setOfficialName(data.officialName);
      setChineseName(replace(data.chineseName));
      setAuthor(data.author!);
      setStudio(data.studio!);
      setDate(data.date?.map((x) => moment(x).toDate()));
      setCategory(data.category!);
      setEpisode(data.episode!);
      setWikiUrl(replace(data.wikiUrl));
      setImgUrl(replace(data.imgUrl));
      setOutline(replace(data.outline));
    } else {
      toast.current?.show({ severity: "error", detail: "找無資料" });
    }
  };

  const save = async () => {
    let req: AnimeInfo = {
      officialName,
      chineseName,
      author,
      studio,
      date,
      category,
      episode,
      wikiUrl,
      imgUrl,
      outline,
    };
    req.startDate = req.date && req.date.length >= 1 ? req.date[0] : undefined;
    req.endDate = req.date && req.date.length === 2 ? req.date[1] : undefined;
    const res = await updateAnimeInfo(req);
    const data: Result<void> | undefined = get(res, "data");
    if (data && data.type === "S") {
      toast.current?.show({ severity: "success", detail: "更新成功" });
    } else {
      toast.current?.show({ severity: "error", detail: "更新失敗" });
    }
  };

  const clear = () => {
    setOfficialName("");
    setChineseName("");
    setAuthor([]);
    setStudio([]);
    setDate(undefined);
    setCategory([]);
    setEpisode(1);
    setWikiUrl("");
    setImgUrl("");
    setOutline("");
  };

  return (
    <div style={{ paddingBottom: "8px" }}>
      <Card className="card">
        <div className="w-full flex-auto">
          <Label>名稱</Label>
          <InputText
            className="w-full"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex justify-content-end pt-4">
          <Button label="搜尋" onClick={() => search()} />
        </div>
      </Card>
      <Card className="card ">
        <div className="grid">
          <div className="flex col-8 flex-column justify-content-between">
            <div className="flex w-auto mb-5 justify-content-center h-full border-solid border-200">
              {imgUrl && (
                <img
                  className="mx-auto max-w-full"
                  key="imgUrl"
                  alt=""
                  height="auto"
                  src={imgUrl}
                  style={{
                    border: "1px solid #dee2e6",
                    borderRadius: "0.25rem",
                    padding: "0.25rem",
                  }}
                />
              )}
            </div>
            <div className="w-full">
              <Label>圖片網址</Label>
              <InputText
                className="w-full"
                id="imgUrl"
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
              />
            </div>
          </div>
          <div className="flex col-4 flex-column">
            <div className="w-full flex-auto">
              <Label>*官方名稱</Label>
              <InputText
                id="officialName"
                className="w-full"
                value={officialName}
                onChange={(e) => setOfficialName(e.target.value)}
              />
            </div>

            <div className="w-full flex-auto">
              <Label>中文名稱</Label>
              <InputText
                id="chineseName"
                className="w-full"
                value={chineseName}
                onChange={(e) => setChineseName(e.target.value)}
              />
            </div>

            <div className="w-full p-fluid">
              <Label>作者</Label>
              <Chips
                className="w-full flex"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value!)}
                placeholder="需要按enter or ,"
                separator=","
              />
            </div>
            <div className="p-fluid">
              <Label>動畫製作</Label>
              <Chips
                id="studio"
                className="w-full"
                value={studio}
                onChange={(e) => setStudio(e.target.value!)}
                placeholder="需要按enter or ,"
                separator=","
              />
            </div>
            <div className="w-full flex-auto">
              <Label>日期</Label>
              <Calendar
                id="date"
                className="w-full"
                readOnlyInput
                selectionMode="range"
                dateFormat="yy/mm/dd"
                value={date}
                onChange={(e) => {
                  if (Array.isArray(e.value)) setDate(e.value);
                }}
              />
            </div>
            <div className="flex-auto">
              <Label>集數</Label>
              <InputNumber
                id="episode"
                className="w-full"
                min={1}
                showButtons
                buttonLayout="horizontal"
                step={1}
                decrementButtonClassName="p-button-danger"
                incrementButtonClassName="p-button-success"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
                value={episode}
                onValueChange={(e) => setEpisode(e.value!)}
              />
            </div>
            <div className="w-full flex-auto">
              <Label>維基百科網址</Label>
              <InputText
                id="wikiUrl"
                className="w-full"
                value={wikiUrl}
                onChange={(e) => setWikiUrl(e.target.value)}
              />
            </div>

            <div className="w-full p-fluid">
              <Label>類型</Label>
              <Chips
                className="w-full flex"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.value!)}
                placeholder="需要按enter or ,"
                separator=","
              />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-column ">
          <Label className="font-bold block mb-2">故事簡介</Label>
          <ReactQuill
            className="flex flex-column"
            style={{ height: "280px" }}
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [
                  { list: "ordered" },
                  { list: "bullet" },
                  { indent: "-1" },
                  { indent: "+1" },
                ],
              ],
            }}
            theme="snow"
            value={outline}
            onChange={(e) => {
              setOutline(e);
            }}
          />
        </div>
        <div className="flex justify-content-end pt-4">
          <Button className="mr-4" label="清除" onClick={clear} />
          <Button label="保存" onClick={save} />
        </div>
      </Card>
      <Toast ref={toast} />
    </div>
  );
};

export default AnimeEdit;
