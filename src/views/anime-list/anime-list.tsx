import { DataView } from "primereact/dataview";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  useAllMessageQuery,
  useAllTagsQuery,
  useAllVideoTagsQuery,
  useAllWatchProgressQuery,
  useAllWatchedQuery,
  useAnimeListQuery,
  useMessageMutation,
  useUpdateVideoTagMutation,
  useWatchProgressMutation,
  useWatchedMutation,
} from "../../redux/api/anime-info-api";
import { AnimeInfo, AnimeTag } from "utils/typings";
import { Chip } from "primereact/chip";
import moment, { isDate } from "moment";
import styled from "styled-components";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";

import "./anime-list.scss";
import { clone, get, isBlank, isEmpty, replace } from "utils/helpers";

import wiki from "assets/icons/wiki.png";
import AnimeEdit from "views/anime-edit/anime-edit";
import { ConfirmDialog } from "primereact/confirmdialog"; // For <ConfirmDialog /> component
// import SvgComponent from "views/anime-list/wiki";
import { InputTextarea } from "primereact/inputtextarea";
import TagList from "views/tag-list/tag-list";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import hash from "object-hash";

const Label = styled.div`
  user-select: none;
  flex: 0 0 auto;
  width: 120px;
  &:after {
    content: ":";
    padding-right: 8px;
  }
`;

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
  const { data: messageData, refetch: allMessageRefetch } =
    useAllMessageQuery();
  const { data: tagData, refetch: allTagRefetch } = useAllTagsQuery();
  const { data: allVideoTags, refetch: allVideoTagRefetch } =
    useAllVideoTagsQuery();

  const [layout, setLayout] = useState("list");

  const [visibleEdit, setVisibleEdit] = useState({ name: "", visible: false });
  const [visibleWatchProgress, setVisibleWatchProgress] = useState({
    name: "",
    value: "",
    visible: false,
  });
  const [visibleMessage, setVisibleMessage] = useState({
    name: "",
    value: "",
    visible: false,
  });
  const [visibleTag, setVisibleTag] = useState(false);
  const [selectTag, setSelectTag] = useState([] as AnimeTag[]);
  const [visibleSelectTag, setVisibleSelectTag] = useState({
    name: "",
    visible: false,
  });
  const [listState, setListState] = useState({
    sortKey: "new",
    searchInput: "",
  });

  useEffect(() => {
    if (animeListData?.type === "S") {
      onSearch(listState.searchInput);
    }
  }, [animeListData, watchedData]);

  const handleDate = (arr: AnimeInfo[]) => {
    let result = clone(arr);
    for (let data of result) {
      data.startDate = new Date(data.startDate);
      data.endDate = new Date(data.startDate);
    }
    onSort(result, listState.sortKey);
    setWatched(result);
    return result;
  };

  const onSearch = (searchInput: string) => {
    setListState({ ...listState, searchInput });
    if (animeListData) {
      let result: AnimeInfo[] = handleDate(animeListData.data);
      if (!isBlank(searchInput)) {
        result = result.filter(
          (x) =>
            x.officialName.indexOf(searchInput) !== -1 ||
            x.chineseName?.indexOf(searchInput) !== -1
        );
      }
      setAnimeList(result);
    }
  };

  const onSort = (list: AnimeInfo[], sortKey: string) => {
    setListState({ ...listState, sortKey });
    list.sort((a, b) => {
      if (
        !isDate(get(a, "startDate")) ||
        !isDate(get(b, "startDate")) ||
        a.startDate === b.startDate
      ) {
        return 0;
      }
      if (sortKey === "new") {
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

  // const animeTemplate = (data: AnimeInfo) => {
  //   if (!data) {
  //     return;
  //   }

  //   if (layout === "list") return ListItem(data);
  //   else if (layout === "grid") return gridItem(data);
  // };

  const ListItem = (props: { data: AnimeInfo }) => {
    const { data } = props;
    const [watched] = useWatchedMutation();

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
                        key={hash(x)}
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
              {allVideoTags?.data[data.officialName] && (
                <div className="flex align-items-center ">
                  <Label>TAG</Label>
                  <span className="flex align-items-center gap-2">
                    {tagData?.data
                      .filter(
                        (x) =>
                          allVideoTags.data[data.officialName].indexOf(x.id) >
                          -1
                      )
                      .map((x) => (
                        <Chip
                          label={x.desc}
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
                    <Outline html={data.outline}></Outline>
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
                <Button
                  label={
                    isBlank(messageData?.data[data.officialName])
                      ? "留訊息"
                      : `留訊息 - ${messageData?.data[data.officialName]}`
                  }
                  icon="pi pi-comments"
                  outlined
                  onClick={() =>
                    setVisibleMessage({
                      visible: true,
                      name: data.officialName,
                      value: replace(messageData?.data[data.officialName]),
                    })
                  }
                ></Button>
                <Button
                  label="TAG"
                  icon="pi pi-tags"
                  outlined
                  onClick={() => {
                    if (
                      allVideoTags?.data[data.officialName] &&
                      tagData?.data
                    ) {
                      setSelectTag(
                        tagData?.data.filter(
                          (x) =>
                            allVideoTags?.data[data.officialName].indexOf(
                              x.id
                            ) > -1
                        )
                      );
                    } else {
                      setSelectTag([]);
                    }

                    setVisibleSelectTag({
                      name: data.officialName,
                      visible: true,
                    });
                  }}
                ></Button>
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
      <Button onClick={() => setVisibleTag(true)}>編輯TAG</Button>
      <DataView
        value={animeList}
        paginator
        rows={30}
        itemTemplate={(item) => (
          <ListItem key={item.officialName} data={item} />
        )}
        header={
          <Header
            onSort={(sortKey: string) => {
              onSort(animeList, sortKey);
              setAnimeList(animeList);
            }}
            onSearch={onSearch}
          />
        }
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
        <AnimeEdit
          isDialog={true}
          searchName={visibleEdit.name}
          closeDialog={() => {
            setVisibleEdit({ name: "", visible: false });
            animeListDataRefetch();
          }}
        />
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
      <Dialog
        header="留言"
        visible={visibleMessage.visible}
        draggable={false}
        onHide={() =>
          setVisibleMessage({ name: "", value: "", visible: false })
        }
      >
        <MessageDialog
          name={visibleMessage.name}
          value={visibleMessage.value}
          onClose={() => {
            allMessageRefetch();
            setVisibleMessage({ name: "", value: "", visible: false });
          }}
        ></MessageDialog>
      </Dialog>
      <ConfirmDialog />
      <Dialog
        style={{ width: "400px", height: "80vh" }}
        header="TAG清單"
        visible={visibleTag}
        draggable={false}
        onHide={() => {
          setVisibleTag(false);
          allTagRefetch();
        }}
      >
        <TagList />
      </Dialog>
      <Dialog
        style={{ width: "300px", height: "60vh" }}
        header="選擇TAG"
        visible={visibleSelectTag.visible}
        draggable={false}
        onHide={() => {
          allVideoTagRefetch();
          setVisibleSelectTag({ name: "", visible: false });
        }}
      >
        <SelectTag
          officialName={visibleSelectTag.name}
          tagData={tagData?.data ? tagData.data : []}
          selectTag={selectTag}
        ></SelectTag>
      </Dialog>
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

const MessageDialog = (props: {
  name: string;
  value: string;
  onClose: () => void;
}) => {
  const { name, value, onClose } = props;
  const [messageInput, setMessageInput] = useState(value);
  const [message] = useMessageMutation();

  const confirm = async () => {
    await message({
      officialName: name,
      value: messageInput,
    });
    onClose();
  };
  return (
    <div
      style={{ display: "flex", flexDirection: "column", paddingTop: "10px" }}
    >
      <InputTextarea
        autoResize
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        rows={5}
        cols={30}
      />
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

const Outline = (props: { html: string }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  useLayoutEffect(() => {
    const checkOverflow = () => {
      if (
        contentRef.current &&
        contentRef.current.scrollHeight > contentRef.current.clientHeight
      ) {
        setIsExpanded(false);
      }
    };
    if (contentRef.current && contentRef.current.clientHeight > 18) {
      setShowBtn(true);
    }
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, []);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div
        style={{
          fontSize: "13px",
          lineHeight: "18px",
          display: "-webkit-box",
          WebkitLineClamp: isExpanded ? "unset" : 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: props.html }}
      ></div>
      {showBtn && (
        <div className="flex justify-content-end">
          <i
            className={isExpanded ? "pi pi-angle-up" : "pi pi-angle-down"}
            style={{ fontSize: "1.2rem" }}
            onClick={handleToggleExpand}
          ></i>
        </div>
      )}
    </div>
  );
};

const Header = (props: {
  onSort: (sortKey: string) => void;
  onSearch: (val: string) => void;
}) => {
  const { onSort, onSearch } = props;
  const [sortKey, setSortKey] = useState<string>("new");
  const [searchInput, setSearchInput] = useState("");
  const sortOptions = [
    { label: "播放日期-新", value: "new" },
    { label: "播放日期-舊", value: "old" },
  ];

  const onSortChange = (event: DropdownChangeEvent) => {
    const value = event.value;
    setSortKey(value);
    onSort(value);
  };

  return (
    <div className="flex justify-content-between">
      <div></div>
      <div>
        <InputText
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              onSearch(searchInput);
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
            onSearch("");
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

const SelectTag = (props: {
  officialName: string;
  tagData: AnimeTag[];
  selectTag: AnimeTag[];
}) => {
  const [selectTag, setSelectTag] = useState(props.selectTag);
  const [updateVideoTag] = useUpdateVideoTagMutation();

  const selectionChange = async (val: AnimeTag[]) => {
    await updateVideoTag({
      officialName: props.officialName,
      idList: val.map((x) => x.id),
    });
    setSelectTag(val);
  };
  return (
    <DataTable
      value={props.tagData}
      selectionMode="multiple"
      dataKey="id"
      scrollable
      scrollHeight="60vh"
      metaKeySelection={false}
      selection={selectTag}
      onSelectionChange={(e) => {
        selectionChange(Array.isArray(e.value) ? e.value : []);
      }}
    >
      <Column field="id" header="id"></Column>
      <Column field="desc" header="desc"></Column>
    </DataTable>
  );
};

export default AnimeList;
