import { DataView } from "primereact/dataview";
import { useEffect, useState } from "react";
import { useAnimeListQuery } from "../../redux/api/anime-info-api";
import { AnimeInfo } from "../../utils/typings";
import { Chip } from "primereact/chip";
import moment from "moment";
import styled from "styled-components";

const Label = styled.div`
  user-select: none;
  &:after {
    content: ":";
    padding-right: 8px;
  }
`;

const AnimeList = () => {
  const [animeList, setAnimeList] = useState([] as AnimeInfo[]);
  const { data } = useAnimeListQuery();
  useEffect(() => {
    if (data?.type === "S") setAnimeList(data.data);
  }, [data]);

  const AnimeTemplate = (data: AnimeInfo) => {
    return (
      <div className="col-12">
        <div className="flex flex-column xl:flex-row xl:align-items-center p-4 gap-4">
          <img
            className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
            src={data.imgUrl}
            alt={data.officialName}
          />
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-2xl font-bold text-900 flex">
                <Label>中文名稱</Label>
                {data.chineseName}
              </div>
              <div className="text-base text-900 flex">
                <Label>官方名稱</Label>
                {data.officialName}
              </div>
              <div className="text-base text-900 flex">
                <Label>播放日期</Label>
                {data.date?.length! >= 1
                  ? moment(data.date![0]).format("YYYY-MM-DD")
                  : ""}
                {data.date?.length! === 2
                  ? " - " + moment(data.date![1]).format("YYYY-MM-DD")
                  : ""}
              </div>
              <div className="flex align-items-center gap-3">
                <Label>作者</Label>
                <span className="flex align-items-center gap-2">
                  {data.author?.map((x) => (
                    <Chip label={x} />
                  ))}
                </span>
              </div>
              <div className="flex align-items-center gap-3">
                <Label>動畫製作</Label>
                <span className="flex align-items-center gap-2">
                  {data.studio?.map((x) => (
                    <Chip label={x} />
                  ))}
                </span>
              </div>
              <div className="flex align-items-center gap-3">
                <Label>類型</Label>
                <span className="flex align-items-center gap-2">
                  {data.category?.map((x) => (
                    <Chip label={x} />
                  ))}
                </span>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div>
      <DataView
        value={animeList}
        paginator
        rows={30}
        itemTemplate={AnimeTemplate}
      />
    </div>
  );
};

export default AnimeList;
