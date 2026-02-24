import { View, Text, Image ,Input,Picker} from '@tarojs/components'
import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'

import './index.scss'

export default function AddHotel({ activeTab, userInfo, editHotel, submitMode = 'submit' }) {
  // 表单输入字段状态
  const [hotelName, setHotelName] = useState('');
  const [hotelIntroduction, setHotelIntroduction] = useState('');
  const [hotelPrice, setHotelPrice] = useState('');
  const [hotelPosition, setHotelPosition] = useState('');
  const [hotelAddress, setHotelAddress] = useState('');
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [supplement, setSupplement] = useState('');

  // 酒店标签管理
  const [LabelsNum, setLabelsNum] = useState(0);
  const [Labels, setLabels] = useState<{id: number, text: string}[]>([]);

  // 设施标签管理
  const [FacilitiesLabelsNum, setFacilitiesLabelsNum] = useState(0);
  const [FacilitiesLabels, setFacilitiesLabels] = useState<{id: number, text: string}[]>([]);

  // 服务标签管理
  const [ServiceLabelsNum, setServiceLabelsNum] = useState(0);
  const [ServiceLabels, setServiceLabels] = useState<{id: number, text: string}[]>([]);

  // 其他状态
  const [selectedStar, setSelectedStar] = useState(0);
  const [hotelImage, setHotelImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<{id: number, image: string}[]>([]);
  const [galleryIdCounter, setGalleryIdCounter] = useState(1);

  // 设施图标管理
  const [selectedFacilities, setSelectedFacilities] = useState<{text: string, icon: string}[]>([]);

  // 房间列表管理
  const [rooms, setRooms] = useState<{
    id: number;
    name: string;
    price: number;
    image: string;
    detail: string[];
    introduction: string;
    tags: string[];
  }[]>([]);
  const [roomIdCounter, setRoomIdCounter] = useState(1);

  // 当editHotel变化时，更新表单状态
  useEffect(() => {
    console.log('EditHotel updated:', editHotel);
    // 无论editHotel是否存在，都先重置所有状态
    setLabelsNum(0);
    setLabels([]);
    setFacilitiesLabelsNum(0);
    setFacilitiesLabels([]);
    setServiceLabelsNum(0);
    setServiceLabels([]);
    setSelectedFacilities([]);
    setRooms([]);
    setRoomIdCounter(1);
    setGalleryImages([]);
    setGalleryIdCounter(1);
    setHotelName('');
    setSelectedStar(0);
    setHotelImage('');
    setHotelIntroduction('');
    setHotelPrice('');
    setHotelPosition('');
    setHotelAddress('');
    setSupplement('');
    setCheckInTime('');
    setCheckOutTime('');

    if (editHotel) {
      // 更新基本信息
      setHotelName(editHotel.message?.name || '');
      setSelectedStar(editHotel.message?.star || 0);
      setHotelImage(editHotel.message?.image || '');
      setHotelIntroduction(editHotel.message?.introduction || '');
      setHotelPrice(editHotel.message?.price?.toString() || '');
      setHotelPosition(editHotel.message?.position || '');
      setHotelAddress(editHotel.message?.address || '');
      setSupplement(editHotel.message?.supplement || '');

      // 更新时间政策
      setCheckInTime(editHotel.timePolicy?.[0] || '');
      setCheckOutTime(editHotel.timePolicy?.[1] || '');

      // 更新图片库
      if (editHotel.bannerList && editHotel.bannerList.length > 0) {
        const images = editHotel.bannerList.map((item, index) => ({
          id: index + 1,
          image: item.image
        }));
        setGalleryImages(images);
        setGalleryIdCounter(images.length + 1);
      }

      // 更新酒店标签
      console.log('Hotel labels:', editHotel.message?.label);
      if (editHotel.message?.label && editHotel.message.label.length > 0) {
        const labels = editHotel.message.label.map((text, index) => ({
          id: index,
          text: text
        }));
        console.log('Processed hotel labels:', labels);
        setLabels(labels);
        setLabelsNum(labels.length);
      }

      // 更新设施标签
      console.log('Facilities labels:', editHotel.amenitiesList);
      if (editHotel.amenitiesList && editHotel.amenitiesList.length > 0) {
        const facilitiesLabels = editHotel.amenitiesList.map((text, index) => ({
          id: index,
          text: text
        }));
        console.log('Processed facilities labels:', facilitiesLabels);
        setFacilitiesLabels(facilitiesLabels);
        setFacilitiesLabelsNum(facilitiesLabels.length);
      }

      // 更新服务标签（使用filterTagList作为服务标签数据源）
      console.log('Service labels:', editHotel.filterTagList);
      if (editHotel.filterTagList && editHotel.filterTagList.length > 0) {
        const serviceLabels = editHotel.filterTagList.map((text, index) => ({
          id: index,
          text: text
        }));
        console.log('Processed service labels:', serviceLabels);
        setServiceLabels(serviceLabels);
        setServiceLabelsNum(serviceLabels.length);
      }

      // 更新设施图标
      console.log('Facilities list:', editHotel.facilitiesList);
      if (editHotel.facilitiesList && editHotel.facilitiesList.length > 0) {
        console.log('Processed facilities list:', editHotel.facilitiesList);
        setSelectedFacilities(editHotel.facilitiesList);
      }

      // 更新房间列表
      if (editHotel.roomList && editHotel.roomList.length > 0) {
        setRooms(editHotel.roomList);
        setRoomIdCounter(editHotel.roomList.length + 1);
      }
    }
  }, [editHotel]);

  // 随机数据生成函数
  const generateRandomPoint = () => {
    return (Math.random() * 0.5 + 4.5).toFixed(1);
  };

  const generateRandomLike = () => {
    return Math.floor(Math.random() * 5000) + 1000;
  };

  const generateRandomFavorites = () => {
    const num = (Math.random() * 10 + 1).toFixed(1);
    return `${num}万收藏`;
  };

  const getRankByPoint = (point: number) => {
    if (point >= 4.5 && point <= 5.0) {
      return '超棒';
    } else if (point >= 4.0 && point < 4.5) {
      return '不错';
    } else {
      return '一般';
    }
  };

  // 生成随机Ranking函数
  const generateRandomRanking = () => {
    const categories = ['美景', '历史', '商务', '亲子', '情侣', '度假', '豪华', '经济型'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomNumber = Math.floor(Math.random() * 50) + 1;
    return `上海${randomCategory}酒店榜 No.${randomNumber}`;
  };

  // 提交表单处理函数
  const handleSubmit = async () => {
    Taro.showModal({
      title: '确认提交',
      content: '您确定要提交表单吗？提交后数据将保存到数据库。',
      confirmText: '确定',
      confirmColor: '#3690f7',
      cancelText: '取消',
      success: async (res) => {
        if (res.confirm) {
          // 生成随机数据
          const point = parseFloat(generateRandomPoint());
          const like = generateRandomLike();
          const favorites = generateRandomFavorites();
          const rank = getRankByPoint(point);
          const ranking = generateRandomRanking();

          // 生成新酒店的 ID
          let newHotelId = editHotel?.id;
          let newMessageId = editHotel?.message?.id;

          if (!editHotel) {
            // 新酒店，获取未被分配的 ID
            try {
              const response = await Taro.request({
                url: 'http://localhost:3000/hotels',
                method: 'GET'
              });

              if (response.statusCode === 200) {
                const hotels = response.data;
                // 计算最大 ID
                const maxId = hotels.reduce((max, hotel) => Math.max(max, parseInt(hotel.id)), 0);
                newHotelId = (maxId + 1).toString();
                // 计算最大 message ID
                const maxMessageId = hotels.reduce((max, hotel) => Math.max(max, hotel.message?.id || 0), 0);
                newMessageId = maxMessageId + 1;
              } else {
                // 如果获取失败，使用默认值
                newHotelId = "1";
                newMessageId = 1;
              }
            } catch (error) {
              console.error('获取酒店列表失败:', error);
              // 出错时使用默认值
              newHotelId = "1";
              newMessageId = 1;
            }
          }

          // 封装表单数据
          const formData = {
            id: newHotelId,
            userId: userInfo?.id || "3",
            status: "待审核",
            message: {
              id: newMessageId,
              name: hotelName,
              star: selectedStar,
              point: point,
              rank: rank,
              like: like,
              favorites: favorites,
              image: hotelImage,
              position: hotelPosition,
              address: hotelAddress,
              introduction: hotelIntroduction,
              label: Labels.map(label => label.text).filter(text => text),
              Ranking: ranking,
              price: parseFloat(hotelPrice) || 0,
              supplement: supplement
            },
            bannerList: galleryImages.map(image => ({
              id: image.id,
              image: image.image
            })),
            facilitiesList: selectedFacilities.map((facility, index) => ({
              text: facility.text,
              icon: facility.icon
            })),
            roomList: rooms.map(room => ({
              id: room.id,
              name: room.name,
              price: room.price,
              image: room.image,
              detail: room.detail.filter(item => item),
              introduction: room.introduction,
              tags: room.tags.filter(tag => tag)
            })),
            filterTagList: ServiceLabels.map(label => label.text).filter(text => text),
            amenitiesList: FacilitiesLabels.map(label => label.text).filter(text => text),
            timePolicy: [checkInTime, checkOutTime]
          };

          // 打印提交模式
          console.log('Submit mode:', submitMode);
          console.log('Form data:', formData);

          try {
            let response;
            if (submitMode === 'update' && editHotel) {
              // 更新现有酒店
              response = await Taro.request({
                url: `http://localhost:3000/hotels/${editHotel.id}`,
                method: 'PUT',
                data: formData
              });
            } else {
              // 创建新酒店
              response = await Taro.request({
                url: 'http://localhost:3000/hotels',
                method: 'POST',
                data: formData
              });
            }

            if (response.statusCode === 200 || response.statusCode === 201) {
              // 提交成功
              console.log('提交成功:', response.data);
              Taro.showToast({
                title: '提交成功，数据已保存到数据库',
                icon: 'success'
              });
            } else {
              throw new Error('提交失败');
            }
          } catch (error) {
            console.error('提交操作失败:', error);
            Taro.showToast({
              title: '提交失败',
              icon: 'none'
            });
          }
        }
      }
    });
  };

  // 清空表单处理函数
  const handleClear = () => {
    Taro.showModal({
      title: '确认清空',
      content: '您确定要清空所有表单数据吗？此操作不可恢复。',
      confirmText: '确定',
      confirmColor: '#3690f7',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 重置所有状态
          setHotelName('');
          setSelectedStar(0);
          setHotelImage('');
          setGalleryImages([]);
          setGalleryIdCounter(1);
          setLabels([]);
          setLabelsNum(0);
          setHotelIntroduction('');
          setHotelPrice('');
          setHotelPosition('');
          setHotelAddress('');
          setCheckInTime('');
          setCheckOutTime('');
          setSupplement('');
          setSelectedFacilities([]);
          setFacilitiesLabels([]);
          setFacilitiesLabelsNum(0);
          setServiceLabels([]);
          setServiceLabelsNum(0);
          setRooms([]);
          setRoomIdCounter(1);

          Taro.showToast({
            title: '表单已清空',
            icon: 'success'
          });
        }
      }
    });
  };

  const facilitiesList = [
    { text: "网红酒店", icon: "icon-jiudian" },
    { text: "新中式风", icon: "icon-gufengwujianzhongguofenggudaishuan_huaban_huaban" },
    { text: "免费停车", icon: "icon-tingche" },
    { text: "一线江景", icon: "icon-Golden-GateBridge" },
    { text: "江景下用餐", icon: "icon-a-godutch" },
    { text: "网红打卡", icon: "icon-wanghongdakadian" },
    { text: "露天泳池", icon: "icon-youyongchi" },
    { text: "宠物友好", icon: "icon-chongwu" },
    { text: "行政酒廊", icon: "icon-hangzhengjiulang" },
    { text: "历史名宅", icon: "icon-homestay" },
    { text: "爵士乐团", icon: "icon-jueshile" },
    { text: "SPA水疗", icon: "icon-anmo" },
    { text: "高空景观", icon: "icon-w_fengjing" },
    { text: "无边泳池", icon: "icon-youyongchi" },
    { text: "米其林餐厅", icon: "icon-fork-knife" },
    { text: "管家服务", icon: ".icon-guanjia" },
    { text: "设计感", icon: "icon-sheji" },
    { text: "静谧花园", icon: "icon-huayuan" },
    { text: "意大利餐厅", icon: "icon-fork-knife" },
    { text: "近地铁站", icon: "icon-ditiezhan" }
  ];

  const handleAddLabel = () => {
    if(LabelsNum < 5){
      setLabelsNum(LabelsNum + 1);
      setLabels([...Labels, {id: LabelsNum, text: ''}]);
    }
  };
  const handleLabelInput = (e, index) => {
    const value = e.detail.value;
    setLabels([...Labels.slice(0, index), {id: index, text: value}, ...Labels.slice(index + 1)]);
  };
  const handleDeleteLabel = (id) => {
    setLabels(Labels.filter(label => label.id !== id));
    setLabelsNum(LabelsNum - 1);
  };

  // 设施标签处理函数
  const handleAddFacilityLabel = () => {
    if(FacilitiesLabelsNum < 7){
      setFacilitiesLabelsNum(FacilitiesLabelsNum + 1);
      setFacilitiesLabels([...FacilitiesLabels, {id: FacilitiesLabelsNum, text: ''}]);
    }
  };
  const handleFacilityLabelInput = (e, index) => {
    const value = e.detail.value;
    setFacilitiesLabels([...FacilitiesLabels.slice(0, index), {id: index, text: value}, ...FacilitiesLabels.slice(index + 1)]);
  };
  const handleDeleteFacilityLabel = (id) => {
    setFacilitiesLabels(FacilitiesLabels.filter(label => label.id !== id));
    setFacilitiesLabelsNum(FacilitiesLabelsNum - 1);
  };

  // 服务标签处理函数
  const handleAddServiceLabel = () => {
    if(ServiceLabelsNum < 5){
      setServiceLabelsNum(ServiceLabelsNum + 1);
      setServiceLabels([...ServiceLabels, {id: ServiceLabelsNum, text: ''}]);
    }
  };
  const handleServiceLabelInput = (e, index) => {
    const value = e.detail.value;
    setServiceLabels([...ServiceLabels.slice(0, index), {id: index, text: value}, ...ServiceLabels.slice(index + 1)]);
  };
  const handleDeleteServiceLabel = (id) => {
    setServiceLabels(ServiceLabels.filter(label => label.id !== id));
    setServiceLabelsNum(ServiceLabelsNum - 1);
  };

  const handleStarClick = (star) => {
    setSelectedStar(star);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHotelImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && galleryImages.length < 3) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = {
          id: galleryIdCounter,
          image: reader.result as string
        };
        setGalleryImages([...galleryImages, newImage]);
        setGalleryIdCounter(galleryIdCounter + 1);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveGalleryImage = (id) => {
    const updatedImages = galleryImages.filter(image => image.id !== id);
    setGalleryImages(updatedImages);
  };

  const handleFacilityToggle = (facility) => {
    const isSelected = selectedFacilities.some(item => item.text === facility.text);
    if (isSelected) {
      setSelectedFacilities(selectedFacilities.filter(item => item.text !== facility.text));
    } else if (selectedFacilities.length < 5) {
      setSelectedFacilities([...selectedFacilities, facility]);
    }
  };

  // 房间列表处理函数
  const handleAddRoom = () => {
    const newRoom = {
      id: roomIdCounter,
      name: "",
      price: 0,
      image: "",
      detail: ["", "", "", ""],
      introduction: "",
      tags: []
    };
    setRooms([...rooms, newRoom]);
    setRoomIdCounter(roomIdCounter + 1);
  };

  const handleDeleteRoom = (roomId) => {
    const updatedRooms = rooms.filter(room => room.id !== roomId);
    // 重新分配连续的id
    const roomsWithUpdatedIds = updatedRooms.map((room, index) => ({
      ...room,
      id: index + 1
    }));
    setRooms(roomsWithUpdatedIds);
    // 更新id计数器
    setRoomIdCounter(roomsWithUpdatedIds.length + 1);
  };

  const handleRoomNameChange = (roomId, value) => {
    setRooms(rooms.map(room =>
      room.id === roomId ? { ...room, name: value } : room
    ));
  };

  const handleRoomPriceChange = (roomId, value) => {
    setRooms(rooms.map(room =>
      room.id === roomId ? { ...room, price: parseFloat(value) || 0 } : room
    ));
  };

  const handleRoomImageChange = (roomId, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRooms(rooms.map(room =>
          room.id === roomId ? { ...room, image: reader.result as string } : room
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRoomDetailChange = (roomId, index, value) => {
    setRooms(rooms.map(room => {
      if (room.id === roomId) {
        const newDetail = [...room.detail];
        newDetail[index] = value;
        return { ...room, detail: newDetail };
      }
      return room;
    }));
  };

  const handleRoomIntroductionChange = (roomId, value) => {
    setRooms(rooms.map(room =>
      room.id === roomId ? { ...room, introduction: value } : room
    ));
  };

  const handleRoomTagChange = (roomId, index, value) => {
    setRooms(rooms.map(room => {
      if (room.id === roomId) {
        const newTags = [...room.tags];
        newTags[index] = value;
        return { ...room, tags: newTags };
      }
      return room;
    }));
  };

  const handleAddRoomTag = (roomId) => {
    setRooms(rooms.map(room =>
      room.id === roomId ? { ...room, tags: [...room.tags, ""] } : room
    ));
  };

  const handleDeleteRoomTag = (roomId, index) => {
    setRooms(rooms.map(room => {
      if (room.id === roomId) {
        const newTags = room.tags.filter((_, i) => i !== index);
        return { ...room, tags: newTags };
      }
      return room;
    }));
  };



  return (
    <View className={`user-content-addhotel ${activeTab ? 'user-content-myhotel-move' : ''}`}>
      <View className='user-content-circle' >
        <View className='user-content-line'></View>
      </View>
      <View className='user-content-circle circle1'>
        <View className='user-content-line'></View>
      </View>
      <View className='user-content-submit' style={{right:'16%'}}>
        <View className='submit-clear submit-button' onClick={handleClear}>
          <View className='submit-text'>清空</View>
        </View>
      </View>
      <View className='user-content-submit'>
        <View className='submit-button' onClick={handleSubmit}>
          <View className='submit-text'>提交</View>
        </View>
      </View>
      <View className='user-content'>
        <View className='user-content-addhotel-message'>
          <View className='user-content-addhotel-message-title'>
            基础信息
          </View>
          <View className='user-content-addhotel-message-item'>
            <Text className='user-content-addhotel-message-item-title'>
              酒店名称
            </Text>
            <Input className='input message-title' placeholder='请输入酒店名称' value={hotelName} onInput={(e) => setHotelName(e.detail.value)}></Input>
          </View>
          <View className='user-content-addhotel-message-item'>
            <Text className='user-content-addhotel-message-item-title'>
              酒店星级
            </Text>
            <View className='starList'>
              {[1, 2, 3, 4, 5].map((star) => (
                <View
                  key={star}
                  className={`star ${selectedStar === star ? 'selected' : ''}`}
                  onClick={() => handleStarClick(star)}
                >
                  {star}
                </View>
              ))}
            </View>
          </View>
          <View className='user-content-addhotel-message-item' style={{height:'120px'}}>
            <Text className='user-content-addhotel-message-item-title'>
              酒店图片
            </Text>
            <View className='image-upload-container'>
              {hotelImage ? (
                <Image className='uploaded-image' src={hotelImage} mode='aspectFill' />
              ) : (
                <View className='upload-placeholder'>
                  <Text>点击上传图片</Text>
                </View>
              )}
              <input
                type='file'
                accept='image/*'
                className='file-input'
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id='image-upload'
              />
              <label htmlFor='image-upload' className='upload-label'></label>
            </View>
          </View>
          <View className='user-content-addhotel-message-item'>
            <Text className='user-content-addhotel-message-item-title'>
              酒店简介
            </Text>
            <Input className='input message-introduction' placeholder='请输入简介' value={hotelIntroduction} onInput={(e) => setHotelIntroduction(e.detail.value)}></Input>
          </View>
          <View className='user-content-addhotel-message-item'>
            <Text className='user-content-addhotel-message-item-title'>
              起步价格
            </Text>
            <Input className='input message-price' placeholder='请输入价格' value={hotelPrice} onInput={(e) => setHotelPrice(e.detail.value)}></Input>
          </View>
          <View className='user-content-addhotel-message-item'>
            <Text className='user-content-addhotel-message-item-title'>
              酒店位置
            </Text>
            <Input className='input message-position' placeholder='请输入位置' value={hotelPosition} onInput={(e) => setHotelPosition(e.detail.value)}></Input>
          </View>
          <View className='user-content-addhotel-message-item'>
            <Text className='user-content-addhotel-message-item-title'>
              酒店地址
            </Text>
            <Input className='input message-address' placeholder='请输入详细地址' value={hotelAddress} onInput={(e) => setHotelAddress(e.detail.value)}></Input>
          </View>
          <View className='user-content-addhotel-message-item'>
            <Text className='user-content-addhotel-message-item-title'>
              优惠信息
            </Text>
            <Input className='input message-supplement' placeholder='请输入优惠信息' value={supplement} onInput={(e) => setSupplement(e.detail.value)}></Input>
          </View>
          <View className='user-content-addhotel-message-item message-label-item' style={{justifyContent: 'flex-start',alignItems: 'flex-start'}}>
            <Text className='user-content-addhotel-message-item-title'>
              酒店标签
            </Text>
            <View className='labels-container'>
              {Labels.map((label, index) => (
                <View key={label.id} className='label-item'>
                  <Input
                    className='input message-label'
                    value={label.text}
                    onInput={(e) => handleLabelInput(e, label.id)}
                  />
                  <View className='message-label-delete' onClick={() => handleDeleteLabel(label.id)}>×</View>
                </View>
              ))}
              {LabelsNum < 5 && <View className='input message-label message-label-add' onClick={handleAddLabel}>+</View>}
            </View>
          </View>
        </View>
        <View className='user-content-addhotel-banner'>
          <View className='user-content-addhotel-banner-title'>
            酒店展示
          </View>
          <View className='gallery-image-title'>
            图片展示
          </View>
          <View className='gallery-upload-container'>

            {galleryImages.map((image) => (
              <View key={image.id} className='gallery-image-item'>
                <Image className='gallery-image' src={image.image} mode='aspectFill' />
                <View className='gallery-image-remove' onClick={() => handleRemoveGalleryImage(image.id)}>×</View>
              </View>
            ))}
            {galleryImages.length < 3 && (
              <View className='gallery-upload-item'>
                <View className='upload-placeholder'>
                  <Text>点击上传图片</Text>
                </View>
                <input
                  type='file'
                  accept='image/*'
                  className='file-input'
                  onChange={handleGalleryImageUpload}
                  style={{ display: 'none' }}
                  id={`gallery-image-upload-${galleryImages.length}`}
                />
                <label htmlFor={`gallery-image-upload-${galleryImages.length}`} className='upload-label'></label>
              </View>
            )}
          </View>
          <View className='facilities-section'>
            <View className='facilities-section-title'>
              酒店设施和其它服务
            </View>
            <View className='facilities-tag-container'>
              {facilitiesList.map((facility, index) => (
                <View
                  key={index}
                  className={`facility-tag ${selectedFacilities.some(item => item.text === facility.text) ? 'selected' : ''}`}
                  onClick={() => handleFacilityToggle(facility)}
                >
                  <Text>{facility.text}</Text>
                </View>
              ))}
            </View>
            <View className='selected-facilities-container'>
              <Text className='selected-facilities-title'>已选择标签 ({selectedFacilities.length}/5):</Text>
              <View className='selected-facilities-list'>
                {selectedFacilities.map((facility, index) => (
                  <View key={index} className='selected-facility-item'>
                    <Text>{facility.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
        <View className='user-content-addhotel-facility'>
          <View className='user-content-addhotel-facility-title'>
            酒店设施和其它服务
          </View>

          {/* 设施标签添加功能 */}
          <View className='facility-labels-section'>
            <View className='facility-labels-title'>
              设施标签 (最多7个)
            </View>
            <View className='facility-labels-container'>
              {FacilitiesLabels.map((label, index) => (
                <View key={label.id} className='label-item'>
                  <Input
                    className='input facility-label'
                    value={label.text}
                    onInput={(e) => handleFacilityLabelInput(e, label.id)}
                  />
                  <View className='facility-label-delete' onClick={() => handleDeleteFacilityLabel(label.id)}>×</View>
                </View>
              ))}
              {FacilitiesLabelsNum < 7 && <View className='input facility-label facility-label-add' onClick={handleAddFacilityLabel}>+</View>}
            </View>
          </View>

          {/* 服务标签添加功能 */}
          <View className='service-labels-section'>
            <View className='service-labels-title'>
              服务标签 (最多5个)
            </View>
            <View className='service-labels-container'>
              {ServiceLabels.map((label, index) => (
                <View key={label.id} className='label-item'>
                  <Input
                    className='input service-label'
                    value={label.text}
                    onInput={(e) => handleServiceLabelInput(e, label.id)}
                  />
                  <View className='service-label-delete' onClick={() => handleDeleteServiceLabel(label.id)}>×</View>
                </View>
              ))}
              {ServiceLabelsNum < 5 && <View className='input service-label service-label-add' onClick={handleAddServiceLabel}>+</View>}
            </View>
          </View>
          <View className='service-time'>
            <View className='service-labels-title'>
              最早入住时间
            </View>
            <Input className='service-time-input input' placeholder='格式为hh-mm' value={checkInTime} onInput={(e) => setCheckInTime(e.detail.value)} />
          </View>
          <View className='service-time'>
            <View className='service-labels-title'>
              最晚退房时间
            </View>
            <Input className='service-time-input input' placeholder='格式为hh-mm' value={checkOutTime} onInput={(e) => setCheckOutTime(e.detail.value)} />
          </View>
        </View>
        <View className='user-content-addhotel-roomList'>
          <View className='user-content-addhotel-roomList-title'>
            房间列表
          </View>

          {/* 添加房间按钮 */}
          <View className='add-room-button' onClick={handleAddRoom}>
            <Text>添加房间</Text>
          </View>

          {/* 房间列表 */}
          {rooms.map((room) => (
            <View key={room.id} className='room-item'>
              <View className='room-header'>
                <Text className='room-id'>房间 {room.id}</Text>
                <View className='room-delete' onClick={() => handleDeleteRoom(room.id)}>×</View>
              </View>

              {/* 房间名称 */}
              <View className='room-field'>
                <Text className='room-field-label'>房间名称：</Text>
                <Input
                  className='input room-input'
                  placeholder='请输入房间名称'
                  value={room.name}
                  onInput={(e) => handleRoomNameChange(room.id, e.detail.value)}
                ></Input>
              </View>

              {/* 房间价格 */}
              <View className='room-field'>
                <Text className='room-field-label'>房间价格：</Text>
                <Input
                  className='input room-input'
                  placeholder='请输入价格'
                  value={room.price ? room.price.toString() : ''}
                  onInput={(e) => handleRoomPriceChange(room.id, e.detail.value)}
                ></Input>
              </View>

              {/* 房间图片 */}
              <View className='room-field'>
                <Text className='room-field-label'>房间图片：</Text>
                <View className='room-image-upload'>
                  {room.image ? (
                    <Image className='room-image' src={room.image} mode='aspectFill' />
                  ) : (
                    <View className='upload-placeholder'>
                      <Text>点击上传图片</Text>
                    </View>
                  )}
                  <input
                    type='file'
                    accept='image/*'
                    className='file-input'
                    onChange={(e) => handleRoomImageChange(room.id, e)}
                    style={{ display: 'none' }}
                    id={`room-image-upload-${room.id}`}
                  />
                  <label htmlFor={`room-image-upload-${room.id}`} className='upload-label'></label>
                </View>
              </View>

              {/* 房间详情 */}
              <View className='room-field'>
                <Text className='room-field-label'>房间详情：</Text>
                <View className='room-detail-list'>
                  {room.detail.map((item, index) => (
                    <Input
                      key={index}
                      className='input room-detail-input'
                      placeholder={`详情 ${index + 1}`}
                      value={item}
                      onInput={(e) => handleRoomDetailChange(room.id, index, e.detail.value)}
                    ></Input>
                  ))}
                </View>
              </View>

              {/* 房间介绍 */}
              <View className='room-field'>
                <Text className='room-field-label'>房间介绍：</Text>
                <Input
                  className='input room-input room-introduction'
                  placeholder='请输入房间介绍'
                  value={room.introduction}
                  onInput={(e) => handleRoomIntroductionChange(room.id, e.detail.value)}
                ></Input>
              </View>

              {/* 房间标签 */}
              <View className='room-field'>
                <Text className='room-field-label'>房间标签：</Text>
                <View className='room-tags-container'>
                  {room.tags.map((tag, index) => (
                    <View key={index} className='room-tag-item'>
                      <Input
                        className='input room-tag-input'
                        placeholder='标签'
                        value={tag}
                        onInput={(e) => handleRoomTagChange(room.id, index, e.detail.value)}
                      ></Input>
                      <View className='room-tag-delete' onClick={() => handleDeleteRoomTag(room.id, index)}>×</View>
                    </View>
                  ))}
                  <View className='room-tag-add' onClick={() => handleAddRoomTag(room.id)}>+</View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}
