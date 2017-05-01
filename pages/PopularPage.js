/**
 * Created by Administrator on 2017/4/15.
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
import ScrollableTabView from "react-native-scrollable-tab-view";
import ProjectRow from "../component/ProjectRow";
import ProjectDetails from './ProjectDetails';

var popular_def_lans = require('../res/data/popular_def_lans.json');

export default class PopularPage extends Component{
   constructor(props){
       super(props);
       this.state= {
           language: []
       }
       popular_def_lans.forEach(item => {
           //console.log(item);
           if(item.checked) this.state.language.push(item);
       });
   }

    getRightButton =() => {
        return <View style={{flexDirection:'row',alignItems:'center'}}>
            <TouchableOpacity
                activeOpacity={0.7}>
                <Image source={require('../res/images/ic_search_white_48pt.png')} style={{width:24,height:24}}/>
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.7}>
                <Image source={require('../res/images/ic_more_vert_white_48pt.png')} style={{width:24,height:24}}/>
            </TouchableOpacity>
        </View>;
    }

    render(){
        return <View style={styles.container}>
            <NavigationBar
                title="热门"
                rightButton={this.getRightButton()}/>
            <ScrollableTabView
                tabBarBackgroundColor="#63B8FF"
                tabBarActiveTextColor="#FFF"
                tabBarInactiveTextColor="#F5FFFA"
                tabBarUnderlineStyle={{backgroundColor:"#E7E7E7",height:2}}>
                {this.state.language.map((item,i) => {
                    console.log("language:"+item.name+";checked:"+item.checked);
                    return (item.checked == undefined || item.checked) ? <PopularTab {...this.props} key={`tab${i}`} tabLabel={item.name}/> : null;
                })}
            </ScrollableTabView>
        </View>
    }

    loadLanguage = () => {
        //AsyncStorage.clear();
        AsyncStorage.getItem('custom_key')
            .then((value) => {
                if(value != null){
                    this.setState({language:JSON.parse(value)});
                }
            });
    }

    componentDidMount = () => {
        this.loadLanguage();
    }
}

class PopularTab extends Component{
    static defaultProps = {
        tabLabel : 'IOS'
    }

    constructor(props){
        super(props);
        this.state = {
            dataSource:new ListView.DataSource({rowHasChanged :(r1,r2) => r1 !== r2}),
            isLoading : true
        };
    }

    handleSelect = (obj) => {
        console.log("handleSelect:"+obj);
        this.props.navigator.push({
            component:ProjectDetails,
            params:{title:obj.full_name,url:obj.html_url}
        });
    }

    //渲染每一行
    _renderRow = (obj) =>{
        //console.log("_renderRow obj:"+obj);
        return <ProjectRow item={obj} onSelect={() => this.handleSelect(obj)}/>;
    }

    handleRefresh = () => {
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
        </View>;
    }

    loadData = () => {
        this.setState({isLoading:true});
        fetch(`https://api.github.com/search/repositories?q=${this.props.tabLabel}&sort=stars`)
            .then(response => response.json())
            .then(json => {
                console.log(json.items);
                //更新数据源
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(json.items),
                    isLoading:false
                });
            }).catch((error) => {
            console.error(error);
        }).done();
    }

    componentDidMount = () => {
        this.loadData();
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    }
});