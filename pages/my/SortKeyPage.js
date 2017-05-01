/**
 * Created by Administrator on 2017/4/22.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    AsyncStorage,
    DeviceEventEmitter
} from 'react-native';

import NavigationBar from '../../component/NavigationBar';
import SortableListView from 'react-native-sortable-listview';
import Toast from "react-native-easy-toast";

var popular_def_lans = require('../../res/data/popular_def_lans.json');

export default class SortKeyPage extends Component{
    constructor(props){
        super(props);
        this.state={
            originData : popular_def_lans, //原始数据
            data:[]
        };
        this.state.originData.forEach(item =>{
            if(item.checked) this.state.data.push(item);
        });
    }

    //返回
    handleBack = ()=>{
        this.doBack();
    }

    doBack = ()=>{
        //把任务栈顶部的任务清除
        this.props.navigator.pop();
    }

    doSave = ()=>{
        //原始数组
        var originArray = this.state.originData;
        //排序后的数组
        var sortedArray = this.state.data;
        //要保存的数组
        var savedArray = [];

        //i用来遍历originalArray
        //j用来遍历sortedArray
        for(var i = 0, j = 0; i < originArray.length; i++){
            var item = originArray[i];
            if(item.checked){
                savedArray[i] = sortedArray[j];
                j++;
            }else{
                savedArray[i] = item;
            }
        }
        AsyncStorage.setItem('custom_key',JSON.stringify(savedArray))
            .then(()=> {
                this.refs.toast.show("保存成功");
                this.doBack();
                //通知HomePage重新加载
                DeviceEventEmitter.emit('HOMEPAGE_RELOAD','HomePage重新加载');
            });
    }

    //保存
    handleSave = ()=>{
        this.doSave();
    }

    getNavLeftBtn = ()=>{
        return <View style={{flexDirection:'row',alignItems:'center'}}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={this.handleBack}>
                <Image source={require('../../res/images/ic_arrow_back_white_36pt.png')} style={{width:24,height:24}}/>
            </TouchableOpacity>
        </View>;
    }

    getNavRightBtn = ()=>{
        return <View style={{flexDirection:'row',alignItems:'center'}}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={this.handleSave}>
                <View style={{marginRight:10}}>
                    <Text style={{fontSize:16,color:'#FFF'}}>保存</Text>
                </View>
            </TouchableOpacity>
        </View>;
    }

    render(){
        return <View style={styles.container}>
            <NavigationBar
                title="语言分类排序"
                rightButton={this.getNavRightBtn()}
                leftButton={this.getNavLeftBtn()}/>
            <SortableListView
                data={this.state.data}
                order={Object.keys(this.state.data)}
                renderRow={item => <RowComponent data={item} />}
                onRowMoved={e=>{
                    this.state.data.splice(e.to,0,this.state.data.splice(e.from,1)[0]);
                    this.forceUpdate(); //强制重新渲染
                }}/>
            <Toast ref="toast"/>
        </View>
    }

    componentDidMount =() =>{
        AsyncStorage.getItem('custom_key')
            .then(value => {
                if(value != null){
                        //原始数据
                        let origin = JSON.parse(value);
                        let d =[];
                        origin.forEach((item) => {
                            if(item.checked)d.push(item);
                        });
                        this.setState({originData:origin,data:d});
                }
            });
    }
}

class RowComponent extends Component{
    static defaultProps = {
        data : {name:''}
    };
    render(){
        //本组件用于封装视图，使其可以正确响应触摸操作。
        //当按下的时候，封装的视图的不透明度会降低，同时会有一个底层的颜色透过而被用户看到，使得视图变暗或变亮
        //underlayColor 有触摸操作时显示出来的底层的颜色
        return <TouchableHighlight
            underlayColor='#EEE'
            style={styles.item}
            {...this.props.sortHandlers}>
            <View style={{flexDirection:'row',paddingLeft:10}}>
                <Image source={require('../../res/images/ic_sort.png')} style={styles.image}/>
                <Text>{this.props.data.name}</Text>
            </View>
        </TouchableHighlight>;
    }
}

const styles = StyleSheet.create({
     container:{
         flex:1
     },
    item:{
        backgroundColor: '#F8F8F8',
        borderBottomWidth:1,
        borderColor:'#EEE',
        height:50,
        justifyContent:'center'
    },
    image:{
        width:16,
        height:16,
        marginRight:10,
        tintColor:'#63B8FF'
    }
});