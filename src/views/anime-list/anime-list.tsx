import { DataView } from "primereact/dataview";
import { useEffect, useState } from "react";
import {
  useAllWatchProgressQuery,
  useAllWatchedQuery,
  useAnimeListQuery,
  useWatchProgressMutation,
  useWatchedMutation,
} from "../../redux/api/anime-info-api";
import { AnimeInfo } from "utils/typings";
import { Chip } from "primereact/chip";
import moment, { isDate } from "moment";
import styled from "styled-components";
import { SelectButton } from "primereact/selectbutton";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";

import ReactQuill from "react-quill";
import "./anime-list.scss";
import { clone, isBlank, isEmpty, replace } from "utils/helpers";

import wiki from "assets/icons/wiki.png";
import AnimeEdit from "views/anime-edit/anime-edit";
import { ConfirmDialog } from "primereact/confirmdialog"; // For <ConfirmDialog /> component
import { confirmDialog } from "primereact/confirmdialog"; // For confirmDialog method
// import SvgComponent from "views/anime-list/wiki";

const Label = styled.div`
  user-select: none;
  flex: 0 0 auto;
  width: 120px;
  &:after {
    content: ":";
    padding-right: 8px;
  }
`;

const ReadOnlyReactQuill = styled.div`
  .ql-container {
    border: 0;
  }
  .ql-editor {
    padding: 0;
  }
`;
interface LayoutOption {
  icon: string;
  value: string;
}
const AnimeList = () => {
  const [animeList, setAnimeList] = useState([] as AnimeInfo[]);
  const { data: animeListData, refetch: animeListDataRefetch } =
    useAnimeListQuery();
  const { data: watchedData, refetch: allWatchedRefetch } =
    useAllWatchedQuery();

  const { data: watchProgressData, refetch: allWatchProgressRefetch } =
    useAllWatchProgressQuery();

  const [searchInput, setSearchInput] = useState("");
  const [layout, setLayout] = useState("list");
  const [sortKey, setSortKey] = useState<string>("new");
  const [visibleEdit, setVisibleEdit] = useState({ name: "", visible: false });
  const [visibleWatchProgress, setVisibleWatchProgress] = useState({
    name: "",
    value: "",
    visible: false,
  });

  useEffect(() => {
    if (animeListData?.type === "S") doSearch(searchInput);
  }, [animeListData, watchedData]);

  const handleDate = (arr: AnimeInfo[]) => {
    let result = clone(arr);
    for (let data of result) {
      data.startDate = new Date(data.startDate);
      data.endDate = new Date(data.startDate);
    }
    doSort(result, sortKey);
    setWatched(result);
    return result;
  };

  const doSearch = (str: string) => {
    if (animeListData) {
      let result: AnimeInfo[] = handleDate(animeListData.data);
      if (!isBlank(str)) {
        result = result.filter(
          (x) =>
            x.officialName.indexOf(searchInput) !== -1 ||
            x.chineseName?.indexOf(searchInput) !== -1
        );
      }
      setAnimeList(result);
    }
  };

  const doSort = (list: AnimeInfo[], sort: string) => {
    list.sort((a, b) => {
      if (
        !isDate(a.startDate) ||
        !isDate(b.startDate) ||
        a.startDate === b.startDate
      ) {
        return 0;
      }
      if (sort === "new") {
        return moment(a.startDate).isAfter(b.startDate) ? -1 : 1;
      } else {
        return moment(a.startDate).isAfter(b.startDate) ? 1 : -1;
      }
    });
  };

  const setWatched = (list: AnimeInfo[]) => {
    if (watchedData?.type === "S") {
      for (let data of list) {
        data.watched = watchedData.data[data?.officialName];
      }
    }
    return list;
  };

  const Header = () => {
    const options: LayoutOption[] = [
      { icon: "pi pi-bars", value: "list" },
      { icon: "pi pi-th-large", value: "grid" },
    ];
    const sortOptions = [
      { label: "播放日期-新", value: "new" },
      { label: "播放日期-舊", value: "old" },
    ];
    const layoutTemplate = (option: LayoutOption) => {
      return <i className={option.icon}></i>;
    };
    const onSortChange = (event: DropdownChangeEvent) => {
      const value = event.value;
      setSortKey(value);
      doSort(animeList, value);
      setAnimeList(animeList);
    };
    return (
      <div className="flex justify-content-between">
        <div>
          {/* <SelectButton
          value={layout}
          optionLabel="value"
          onChange={(e) => setLayout(e.value)}
          itemTemplate={layoutTemplate}
          options={options}
        /> */}
        </div>
        <div>
          <InputText
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.code === "Enter") {
                doSearch(searchInput);
              }
            }}
          />
          <Button
            icon="pi pi-times"
            rounded
            text
            severity="secondary"
            onClick={() => {
              setSearchInput("");
              doSearch("");
            }}
          />
        </div>
        <Dropdown
          options={sortOptions}
          value={sortKey}
          optionLabel="label"
          placeholder={sortOptions[0].label}
          onChange={onSortChange}
          className="w-full sm:w-14rem"
        />
      </div>
    );
  };

  const animeTemplate = (data: AnimeInfo) => {
    if (!data) {
      return;
    }

    if (layout === "list") return ListItem(data);
    else if (layout === "grid") return gridItem(data);
  };

  const ListItem = (data: AnimeInfo) => {
    const [watched] = useWatchedMutation();

    const Item = styled.div`
      &:hover {
        .editbutton {
          display: block;
        }
      }
      .editbutton {
        display: none;
        right: 0px;
        top: 0px;
      }
    `;

    const setWatched = async (data: AnimeInfo) => {
      await watched({
        officialName: data.officialName,
        watched: !data.watched,
      });

      allWatchedRefetch();
    };
    return (
      <Item className="col-12 relative">
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
              <div className="text-base text-900 flex">
                <Label>集數</Label>
                {data.episode}
              </div>
              {!isEmpty(data.author) && (
                <div className="flex align-items-center">
                  <Label>作者</Label>

                  <span className="flex align-items-center gap-2">
                    {data.author?.map((x) => (
                      <Chip
                        label={x}
                        style={{ cursor: "pointer", userSelect: "none" }}
                      />
                    ))}
                  </span>
                </div>
              )}

              {!isEmpty(data.studio) && (
                <div className="flex align-items-center">
                  <Label>動畫製作</Label>
                  <span className="flex align-items-center gap-2">
                    {data.studio?.map((x) => (
                      <Chip
                        label={x}
                        style={{ cursor: "pointer", userSelect: "none" }}
                      />
                    ))}
                  </span>
                </div>
              )}

              {!isEmpty(data.category) && (
                <div className="flex align-items-center ">
                  <Label>類型</Label>
                  <span className="flex align-items-center gap-2">
                    {data.category?.map((x) => (
                      <Chip
                        label={x}
                        style={{ cursor: "pointer", userSelect: "none" }}
                      />
                    ))}
                  </span>
                </div>
              )}
              {data.outline && (
                <div className="flex align-items-start ">
                  <Label>大綱</Label>
                  <span className="flex align-items-center ">
                    <ReadOnlyReactQuill>
                      <ReactQuill
                        defaultValue={data.outline}
                        readOnly
                        theme="snow"
                        modules={{
                          toolbar: false,
                        }}
                      />
                    </ReadOnlyReactQuill>
                  </span>
                </div>
              )}
              <div>
                <Button
                  label="看完"
                  icon={`${data.watched ? "pi pi-star-fill" : "pi pi-star"}`}
                  outlined
                  onClick={() => {
                    setWatched(data);
                  }}
                ></Button>
                <Button
                  label={
                    isBlank(watchProgressData?.data[data.officialName])
                      ? "觀看進度"
                      : `觀看進度 - ${
                          watchProgressData?.data[data.officialName]
                        }`
                  }
                  icon="pi pi-calendar-plus"
                  outlined
                  onClick={() =>
                    setVisibleWatchProgress({
                      visible: true,
                      name: data.officialName,
                      value: replace(
                        watchProgressData?.data[data.officialName]
                      ),
                    })
                  }
                ></Button>
                <Button label="留訊息" icon="pi pi-comments" outlined></Button>
                <Button label="TAG" icon="pi pi-tags" outlined></Button>
              </div>
            </div>
            <div></div>
          </div>
        </div>
        <div className="absolute editbutton">
          {data.wikiUrl && (
            <Button
              rounded
              text
              icon={
                <img
                  src={wiki}
                  alt=""
                  style={{ width: "25px" }}
                  onClick={() => window.open(data.wikiUrl, "_new")}
                ></img>
              }
            ></Button>
          )}

          <Button
            icon="pi pi-pencil"
            rounded
            text
            aria-label="Filter"
            onClick={() =>
              setVisibleEdit({ name: data.officialName, visible: true })
            }
          ></Button>
        </div>
      </Item>
    );
  };

  return (
    <div>
      <DataView
        value={animeList}
        paginator
        rows={30}
        itemTemplate={animeTemplate}
        header={Header()}
      />
      <Dialog
        header="編輯"
        visible={visibleEdit.visible}
        onHide={() => {
          setVisibleEdit({ name: "", visible: false });
          animeListDataRefetch();
        }}
        style={{ width: "100vw" }}
      >
        <AnimeEdit isDialog={true} searchName={visibleEdit.name} />
      </Dialog>
      <Dialog
        header="觀看進度"
        visible={visibleWatchProgress.visible}
        draggable={false}
        onHide={() =>
          setVisibleWatchProgress({ name: "", value: "", visible: false })
        }
      >
        <WatchProgressDialog
          name={visibleWatchProgress.name}
          value={visibleWatchProgress.value}
          onClose={() => {
            allWatchProgressRefetch();
            setVisibleWatchProgress({ name: "", value: "", visible: false });
          }}
        ></WatchProgressDialog>
      </Dialog>
      <ConfirmDialog />
    </div>
  );
};

const WatchProgressDialog = (props: {
  name: string;
  value: string;
  onClose: () => void;
}) => {
  const { name, value, onClose } = props;
  const [watchProgressInput, setWatchProgressInput] = useState(value);
  const [watchProgress] = useWatchProgressMutation();

  const confirm = async () => {
    await watchProgress({
      officialName: name,
      value: watchProgressInput,
    });
    onClose();
  };
  return (
    <div
      style={{ display: "flex", flexDirection: "column", paddingTop: "10px" }}
    >
      <InputText
        value={watchProgressInput}
        onChange={(e) => setWatchProgressInput(e.target.value)}
      ></InputText>
      <div
        style={{ display: "flex", justifyContent: "end", paddingTop: "10px" }}
      >
        <Button
          label="取消"
          onClick={onClose}
          style={{ marginRight: "5px" }}
        ></Button>
        <Button label="確定" onClick={confirm}></Button>
      </div>
    </div>
  );
};

const gridItem = (data: AnimeInfo) => {
  return <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2"></div>;
};

export default AnimeList;
