import { InputText } from "primereact/inputtext";
import styled from "styled-components";
import { useState } from "react";
import { Editor } from "primereact/editor";
import {
  InputNumber,
  InputNumberChangeEvent,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { Chips } from "primereact/chips";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import { AnimeInfo } from "../../utils/typings";
import {
  useSearchAnimeInfoMutation,
  useUpdateAnimeInfoMutation,
} from "../../redux/api/anime-info-api";
import moment from "moment";

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

const initialValues: AnimeInfo = {
  officialName: "",
  chineseName: "",
  author: [],
  studio: [],
  date: undefined,
  category: [],
  episode: 1,
  wikiUrl: "",
  imgUrl: "",
  outline: "",
  startDate: undefined,
  endDate: undefined,
};

const AnimeEdit = () => {
  const [name, setName] = useState("");
  const [values, setValues] = useState(initialValues);
  const [updateAnimeInfo] = useUpdateAnimeInfoMutation();
  const [searchAnimeInfo, { data: searchData }] = useSearchAnimeInfoMutation();

  const handleInputChange = (e: any) => {
    const { id, value } = e.target;
    setValues({
      ...values,
      [id]: value,
    });
  };
  const handleNumberInputChange = (
    id: string,
    e: InputNumberValueChangeEvent
  ) => {
    setValues({
      ...values,
      [id]: e.value,
    });
  };

  const search = async () => {
    console.log(process.env);

    console.log(name);
    await searchAnimeInfo({ name });
    if (searchData && searchData.data) {
      let data = searchData.data;
      data.date = data.date?.map((x) => moment(x).toDate());
      setValues(data);
    }
  };

  const update = async () => {
    let req = { ...values };
    req.startDate = req.date && req.date.length >= 1 ? req.date[0] : undefined;
    req.endDate = req.date && req.date.length === 2 ? req.date[1] : undefined;
    const res = await updateAnimeInfo(req);
    console.log(res);
  };

  return (
    <>
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
              {values.imgUrl && (
                <img
                  alt=""
                  height="auto"
                  src={values.imgUrl}
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
                value={values.imgUrl}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex col-4 flex-column">
            <div className="w-full flex-auto">
              <Label>*官方名稱</Label>
              <InputText
                id="officialName"
                className="w-full"
                value={values.officialName}
                onChange={handleInputChange}
              />
            </div>

            <div className="w-full flex-auto">
              <Label>中文名稱</Label>
              <InputText
                id="chineseName"
                className="w-full"
                value={values.chineseName}
                onChange={handleInputChange}
              />
            </div>

            <div className="w-full p-fluid">
              <Label>作者</Label>
              <Chips
                className="w-full flex"
                id="author"
                value={values.author}
                onChange={handleInputChange}
                placeholder="需要按enter or ,"
                separator=","
              />
            </div>
            <div className="p-fluid">
              <Label>動畫製作</Label>
              <Chips
                id="studio"
                className="w-full"
                value={values.studio}
                onChange={handleInputChange}
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
                value={values.date}
                onChange={(e) => {
                  handleInputChange(e);
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
                value={values.episode}
                onValueChange={(e) => handleNumberInputChange("episode", e)}
              />
            </div>
            <div className="w-full flex-auto">
              <Label>維基百科網址</Label>
              <InputText
                id="wikiUrl"
                className="w-full"
                value={values.wikiUrl}
                onChange={handleInputChange}
              />
            </div>

            <div className="w-full p-fluid">
              <Label>類型</Label>
              <Chips
                className="w-full flex"
                id="category"
                value={values.category}
                onChange={handleInputChange}
                placeholder="需要按enter or ,"
                separator=","
              />
            </div>
          </div>
        </div>

        <div className="w-full flex-auto">
          <Label className="font-bold block mb-2">故事簡介</Label>
          <Editor
            style={{ height: "320px" }}
            id="outline"
            value={values.outline}
            headerTemplate={
              <span className="ql-formats">
                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-italic" aria-label="Italic"></button>
                <button
                  className="ql-underline"
                  aria-label="Underline"
                ></button>
              </span>
            }
            onTextChange={(e) => {
              setValues({ ...values, outline: e.htmlValue! });
            }}
          />
        </div>
        <div className="flex justify-content-end pt-4">
          <Button
            className="mr-4"
            label="清除"
            onClick={() => setValues(initialValues)}
          />
          <Button label="更新" onClick={() => update()} />
        </div>
      </Card>
    </>
  );
};

export default AnimeEdit;
