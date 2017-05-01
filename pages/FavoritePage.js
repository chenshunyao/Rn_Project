/**
 * Created by Administrator on 2017/4/29.
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
import ScrollableTabView from 'react-native-scrollable-tab-view';
import FavoriteRow from '../component/FavoriteRow';
import ProjectDetails from '../pages/ProjectDetails';

export default class FavoritePage extends Component{

    constructor(props){
        super(props);
        this.state={
            favTab:["Popluar","Trending"]
        }
    }

    getRightButton = () => {
        return <View ref="moreMenuButton">
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={()=>this.refs.moreMenu.showPopover()}>
                <Image source={require('../res/images/ic_more_vert_white_48pt.png')} style={{width:24,height:24}}/>
            </TouchableOpacity>
        </View>;
    }
    


    render(){
        return <View style={styles.container}>
            <NavigationBar
                title="收藏"
                rightButton={this.getRightButton}/>
            <ScrollableTabView
                tabBarBackgroundColor="#63B8FF"
                tabBarActiveTextColor="#FFF"
                tabBarInactiveTextColor="#F5FFFA"
                tabBarUnderlineStyle={{backgroundColor:"#E7E7E7",height:2}}>
                {this.state.favTab.map((item,i) => {
                    return <FavoriteTab key={`tab${i}`} tabLable={item}/>
                })}
            </ScrollableTabView>
        </View>
    }

}

class FavoriteTab extends Component{
    static defaultProps = {
        tabLable:'Popular'
    }

    constructor(props){
        super(props);
        this.state={
            dataSource:new ListView.dataSource({rowHasChanged :(r1,r2) => r1 !== r2}),
            isLoading:true
        }
    }

    handleRefresh = () => {
        
    }

    selectFav = (obj) => {
        this.props.navigator.push({
            component:ProjectDetails,
            params:{title:obj.full_name,url:obj.html_url}
        });
    }

    _renderRow = (obj) => {
        return <FavoriteRow item={obj} onSelect={()=> this.selectFav(obj)}/>
    }

    loadFavData = () =>{

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
        this.loadFavData();
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    }
});