import React from 'react'
import { View } from 'react-native'
import { Header, RowComponent, SpaceComponent, TextComponent } from '.'
import { colors } from '../constants/colors'
import { showUIIconTarget } from '../constants/showUIIconTarget'

const TargetComponent = () => {
  return (
    <View
      style={{
        backgroundColor: colors.primaryLight,
        flex: 1,
      }}
    >
      <Header />

      <RowComponent justify="space-between" styles={{ paddingTop: 10 }}>
        <RowComponent>
          {/* {showUIIconTarget(title, widthSmall ? 36 : 52, widthSmall ? 36 : 52)} */}
          <SpaceComponent width={8} />
          {/* <TextComponent text={title.toUpperCase()} size={widthSmall ? sizes.smallTitle : sizes.bigTitle} /> */}
        </RowComponent>
        {/* <SearchComponent
          placeholder="Nhập mục tiêu "
          title="Tìm mục tiêu"
          onChange={(val) => setTargetsNew(val)}
          type="searchTarget"
          arrSource={targets}
        /> */}

        {/* <button
          type="button"
          className="btn btn-danger"
          data-bs-dismiss="modal"
          onClick={handleRemoveSelect}
          style={{
            fontSize: widthSmall ? sizes.text : undefined
          }}
        >
          Bỏ chọn tất cả
        </button> */}
      </RowComponent>
    </View>
  )
}

export default TargetComponent