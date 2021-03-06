/**
 * Created by Administrator on 2017/4/16.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity
} from 'react-native';

export default class ProjectRow extends Component{
    static defaultProps = {
        item: {}
    }

    constructor(props){
        super(props);
        this.state={
            isFavorite:false,
        }
    }

    handleFav = (obj) => {
        console.log("handleFav obj:"+obj);
        this.setState({isFavorite:!this.state.isFavorite});
        //将数据更新到数据库中
        
    }

    render(){
        var item = this.props.item;
        console.log("projectRow:"+item);
        return <TouchableOpacity
            activeOpacity={0.5}
            onPress={this.props.onSelect}>
            <View style={styles.container}>
                <Text style={styles.title}>{item.full_name}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <View style={styles.bottom}>
                    <View style={styles.bottomTextWrapper}>
                        <Text>作者：</Text>
                        <Image style={{width:22,height:22}} source={{uri:item.owner.avatar_url}}/>
                    </View>
                    <View style={styles.bottomTextWrapper}>
                        <Text>星：</Text>
                        <Text>{item.stargazers_count}</Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={()=>this.handleFav(item)}>
                        <Image source={this.state.isFavorite ? require("../res/images/ic_star.png") : require("../res/images/ic_unstar_transparent.png")} style={{width:22,height:22}}/>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#FFF',
        flexDirection:'column',
        padding:10,
        marginLeft:5,
        marginRight:5,
        marginVertical:5,
        borderColor:'#dddddd',
        borderWidth:0.5,
        borderRadius:2,
        shadowColor:'gray',
        shadowOffset:{width:0.5,height:0.5},
        shadowRadius:1, //阴影半径
        shadowOpacity:0.4,
        elevation:2 //Android 投影
    },
    title:{
        fontSize:16,
        marginBottom:2,
        color:'#212121'
    },
    description:{
        fontSize:14,
        marginBottom:2,
        color:'#757575'
    },
    bottom:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    bottomTextWrapper:{
        flexDirection:'row',
        alignItems:'center'
    }

});