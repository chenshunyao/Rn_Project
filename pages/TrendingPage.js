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
    ListView,
    RefreshControl,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';

import NavigationBar from '../component/NavigationBar';
import GitHubTrending from 'GitHubTrending';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ProjectDetails from './ProjectDetails';
import Popover from '../component/Popover';
import TrendingProjectRow from '../component/TrendingProjectRow';
import MoreMenu from '../component/MoreMenu';

var popular_def_lans = require('../res/data/popular_def_lans.json');

const TIME_MAP = new Map([
    ["今 天", "since=daily"],
    ["本 周", "since=weekly"],
    ["本 月", "since=monthly"]
]);

export default class TrendingPage extends Component{
    constructor(props){
        super(props);
        this.state={
            data:[],
            isVisible:false,
            buttonRect:[],
            timeSpan:{key:'今 天',value:"since=daily"}
        }
        popular_def_lans.forEach((item) => {
            if(item.checked) this.state.data.push(item);
        });
    }

    showPopover =()=>{
        this.refs.button.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                buttonRect: {x: px, y: py, width: width, height: height}
            });
        });
    }
    closePopover = ()=>{
        this.setState({isVisible: false});
    }
    renderTitleView = ()=>{
        return <TouchableOpacity
            ref="button"
            activeOpacity={0.5}
            onPress={this.showPopover}>
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={{color:'#FFF',fontSize:16}}>趋势 {this.state.timeSpan.key}</Text>
                <Image source={require('../res/images/ic_spinner_triangle.png')} style={{width:12,height:12,marginLeft:5}}/>
            </View>
        </TouchableOpacity>;
    }

    getNavigationRightButton = () => {
        return <View ref="moreMenuButton">
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={()=>this.refs.moreMenu.showPopover()}>
                <Image source={require('../res/images/ic_more_vert_white_48pt.png')} style={{width:24,height:24}}/>
            </TouchableOpacity>
        </View>;
    }

    handleTimeSelect = (key,value) => {
        this.setState({timeSpan:{key:key,value:value}});
        this.closePopover();
    }

    renderTimeMap = () => {
        var views =[];
        for(let [key,value] of TIME_MAP){
            views.push(<TouchableOpacity key={`pop_${value}`} onPress={()=>this.handleTimeSelect(key,value)}>
                <Text style={{fontSize:18,color:'#FFF',padding:8}}>{key}</Text>
            </TouchableOpacity>);
        }
        return <View style={{alignItems:'center'}}>
            {views}
            </View>;
    }

    render(){
        return <View style={styles.container}>
            <NavigationBar
                titleView={this.renderTitleView()}
                rightButton={this.getNavigationRightButton()}/>
            <ScrollableTabView
                tabBarBackgroundColor="#63B8FF"
                tabBarActiveTextColor="#FFF"
                tabBarInactiveTextColor="#F5FFFA"
                tabBarUnderlineStyle={{backgroundColor:"#E7E7E7",height:2}}>
                {
                    this.state.data.map((item,i)=>{
                        return (item.checked) ? <TrendingTab {...this.props} key={`tab${i}`} tabLabel={item.name} timeSpan={this.state.timeSpan}/> : null;
                    })
                }
            </ScrollableTabView>
            <Popover
                isVisible={this.state.isVisible}
                fromRect={this.state.buttonRect}
                onClose={this.closePopover}
                contentStyle={{backgroundColor:'#343434',opacity:0.8}}
                placement="bottom">
                {this.renderTimeMap()}
            </Popover>
            <MoreMenu ref="moreMenu" anchorView={() => this.refs.moreMenuButton}/>
        </View>
    }
}

class TrendingTab extends Component{
    static defaultProps ={
        tabLabel:'IOS'
    }

    constructor(props){
        super(props);
        this.state={
            dataSource:new ListView.DataSource({rowHasChanged :(r1,r2) => r1 !== r2}),
            isLoading:true
        }
    }

    //项目被选中，跳转到详情页
    handleProjectSelect = (obj)=>{
        //console.log(obj);
        this.props.navigator.push({
            component:ProjectDetails,
            params:{title:obj.fullName,url:`https://github.com${obj.url}`}
        });
    }

    _renderRow = (obj) => {
        return <TrendingProjectRow item={obj} onSelect={()=>this.handleProjectSelect(obj)}/>;
    }

    loadData = (time="since=daily") => {
        this.setState({isLoading:true});
        //请求数据
        new GitHubTrending().fetchTrending(`https://github.com/trending/${this.props.tabLabel}?${time}`)
            .then((value) => {
                //更新dataSource
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(value),
                    isLoading:false});
            }).catch(error => {
            console.error(error);
        });
    }

    handleRefresh = () => {
        console.log("handleRefresh:"+this.props.timeSpan.key);
        this.loadData();
    }

    render(){
        return <View style={styles.container}>
            <ListView 
                dataSource={this.state.dataSource}
                renderRow={this._renderRow}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={this.handleRefresh}
                        tintColor="#63B8FF"
                        title="正在加载..."
                        titleColor="#63B8FF"
                        colors={['#63B8FF']}/>}
            />
        </View>
    }

    componentDidMount(){
        //加载数据
        this.loadData();
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.timeSpan.key != this.props.timeSpan.key){
            this.loadData(nextProps.timeSpan.value);
        }
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    }
});