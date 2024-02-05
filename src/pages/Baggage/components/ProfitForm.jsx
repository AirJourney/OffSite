import {
  ProFormSelect,
  ProFormText,
  ProForm,
  ModalForm,
  ProFormDateRangePicker,
  ProFormDigit,
  ProFormDigitRange,
  ProFormDependency,
} from '@ant-design/pro-form';
import { useIntl } from 'umi';
import moment from 'moment';

const ProfitForm = (props) => {
  const intl = useIntl();

  const parseData = () =>{
    const {adult={},child={},infant={},dateStart,dateEnd,type,company,flightType,flightNo,cabin,IPCC} = props.values;
    const {carry:aCarry={},hand:aHand={}} = adult;
    const {carry:cCarry={},hand:cHand={}} = child;
    const {carry:iCarry={},hand:iHand={}} = infant;
    return {
      enable: props.values.enable,
      cabin: cabin?.join(','),
      company,
      IPCC,
      flightType: flightType,
      number: flightNo?.join(','),
      type: { value: type || 0 },
      dateRange: dateStart && dateEnd ? [moment(dateStart),moment(dateEnd)]: [],
      from: props.values.from,
      to: props.values.to,
      adultCPiece: aCarry.piece,
      adultCWeight: aCarry.weight,
      adultCLimit: aCarry.limit,
      adultHPiece: aHand.piece,
      adultHWeight: aHand.weight,
      adultHLimit: aHand.limit,
      childCPiece: cCarry.piece,
      childCWeight: cCarry.weight,
      childCLimit: cCarry.limit,
      childHPiece: cHand.piece,
      childHWeight: cHand.weight,
      childHLimit: cHand.limit,
      infantCPiece: iCarry.piece,
      infantCWeight: iCarry.weight,
      infantCLimit: iCarry.limit,
      infantHPiece: iHand.piece,
      infantHWeight: iHand.weight,
      infantHLimit: iHand.limit,
    }
  }
  const combineData = (values) =>{
    const {
      dateRange,number,cabin,from,to,type,
      adultCPiece,adultCWeight,adultCLimit,
      adultHPiece,adultHWeight,adultHLimit,
      childCPiece,childCWeight,childCLimit,
      childHPiece,childHWeight,childHLimit,
      infantCPiece,infantCWeight,infantCLimit,
      infantHPiece,infantHWeight,infantHLimit,
      ...left
    } = values;
try {
  const params = {
    ...left,
    type: type.value,
    from: from && from.toUpperCase() === 'global' ? undefined : from,
    to: to && to.toUpperCase() === 'global' ? undefined : from,
    cabin: cabin ? cabin.split(',') : undefined,
    dateStart: type.value === 0 ? undefined : dateRange?.[0],
    dateEnd: type.value === 0 ? undefined : dateRange?.[1],
    flightNo: number ? number?.split(',') : undefined,
    adult:{
      carry:{
        piece:adultCPiece,
        weight:adultCWeight,
        limit:adultCLimit,
      },
      hand:{
        piece:adultHPiece,
        weight:adultHWeight,
        limit:adultHLimit,
      },
    },
    child:{
      carry:{
        piece:childCPiece,
        weight:childCWeight,
        limit:childCLimit,
      },
      hand:{
        piece:childHPiece,
        weight:childHWeight,
        limit:childHLimit,
      },
    },
    infant:{
      carry:{
        piece:infantCPiece,
        weight:infantCWeight,
        limit:infantCLimit,
      },
      hand:{
        piece:infantHPiece,
        weight:infantHWeight,
        limit:infantHLimit,
      },
    },
  }
  props.onFinish?.(params)
} catch (error) {
  console.log(error)
}

  }
  return (
    <ModalForm
      initialValues={parseData()}
      title="行李额编辑"
      preserve={false}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => {
          props.setModalVisit(false);
        },
      }}
      visible={props.modalVisit}
      onFinish={combineData}
      style={{
        padding: 24,
      }}
    >
      <ProForm.Group>
        <ProFormSelect
          valueEnum={{
            OW: '单程',
            RT: '往返',
          }}
          initialValue="OW"
          width="sm"
          name="flightType"
          label="适用行程类型"
          rules={[{ required: true, message: '行程类型必选!' }]}
        />
        <ProFormText
          // width="md"
          name="from"
          label="出发"
          tooltip="请输入三字码,全局请置空"
        />
        <ProFormText
          // width="md"
          name="to"
          label="到达"
          tooltip="请输入三字码,全局请置空"
        />
        <ProFormText
          name="IPCC"
          label="IPCC"
        />
        <ProFormSelect
            fieldProps={{
              labelInValue: true,
              defaultValue: { value: 0 },
              allowClear: false,
            }}
            request={async () => [
              { label: '不限时间', value: 0 },
              { label: '时间段', value: 1 },
              { label: '时间距离', value: 2 },
            ]}
            name="type"
            width="md"
            label="生效时间类型"
        />
         <ProFormDependency name={['type']}>
          {({ type }) => {
            if(!type || type.value === 0 ){
              return null;
            }
            if (type && type.value === 2) {
              return (
                  <ProFormDigitRange
                    label="生效时间段"
                    name="dateRange"
                    separator="-"
                    placeholder={['开始时间', '结束时间']}
                    fieldProps={{ precision: 0, min: 0, defaultValue: [2, 60] }}
                    rules={[{ required: true, message: '生效时间段必填!' }]}
                  />
              );
            }
            return (
              <ProFormDateRangePicker
                width="xl"
                label="旅行时间段"
                name="dateRange"
                rules={[{ required: true, message: '旅行时间段必填!' }]}
              />
            ) ;
          }}
         </ProFormDependency>
      

        <ProFormText
          name="company"
          label="航司"
        />
        <ProFormText
          name="number"
          label="航班号"
          tooltip="例如: 输入'2711,1023',多航班适用,隔开"
        />
        <ProFormText
          name="cabin"
          label="舱位"
          tooltip="例如: 输入'A,Y',多舱位适用,隔开"
        />
        <ProFormDigit
          name="adultCPiece"
          label="成人托运行李数量"
          fieldProps={{ precision: 0 }}
        />
        <ProFormDigit
          name="adultCWeight"
          label="成人托运行李重量(kg)/件"
        />
        <ProFormText
          name="adultCLimit"
          label="成人托运规格限制"
        />
        <ProFormDigit
          name="adultHPiece"
          label="成人手提行李数量"
          fieldProps={{ precision: 0 }}
        />
        <ProFormDigit
          name="adultHWeight"
          label="成人手提行李重量(kg)/件"
        />
        <ProFormText
          name="adultHLimit"
          label="成人手提规格限制"
        />
        <ProFormDigit
          name="childCPiece"
          label="儿童托运行李数量"
          fieldProps={{ precision: 0 }}
        />
        <ProFormDigit
          name="childCWeight"
          label="儿童托运行李重量(kg)/件"
        />
        <ProFormText
          name="childCLimit"
          label="儿童托运规格限制"
        />
        <ProFormDigit
          name="childHPiece"
          label="儿童手提行李数量"
          fieldProps={{ precision: 0 }}
        />
        <ProFormDigit
          name="childHWeight"
          label="儿童手提行李重量(kg)/件"
        />
        <ProFormText
          name="childHLimit"
          label="儿童手提规格限制"
        />
        {/* <ProFormDigit
          name="infantCPiece"
          label="婴儿托运行李数量"
          fieldProps={{ precision: 0 }}
        />
        <ProFormDigit
          name="infantCWeight"
          label="婴儿托运行李重量(kg)/件"
        />
        <ProFormText
          name="infantCLimit"
          label="婴儿托运规格限制"
        />
        <ProFormDigit
          name="infantHPiece"
          label="婴儿手提行李数量"
          fieldProps={{ precision: 0 }}
        />
        <ProFormDigit
          name="infantHWeight"
          label="婴儿手提行李重量(kg)/件"
        />
        <ProFormText
          name="infantHLimit"
          label="婴儿手提规格限制"
        /> */}
      </ProForm.Group>
    </ModalForm>
  );
};

export default ProfitForm;
