import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput
} from 'react-native';
import moment from 'moment';
import Swiper from 'react-native-swiper';
import ButtonAction from '../Components/ButtonAction';
import Header from '../Components/Header';
import { Entypo, FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { format } from "date-fns";
import pt from "date-fns/locale/pt";
import { api } from "../Lib/axios";


const { width } = Dimensions.get('window');

export default function Agenda() {
  const swiper = useRef();
  const [value, setValue] = useState(new Date());
  const [week, setWeek] = useState(0);
  const [event, setEvent] = useState()

  const [userId, setUserId] = useState(1)
  const [title, setTitle] = useState()
  const [description, setDescription] = useState()
  const [local, setLocal] = useState()
  const [time, setTime] = useState()

  const weeks = React.useMemo(() => {
    const start = moment().add(week, 'weeks').startOf('week');

    return [-1, 0, 1].map(adj => {
      return Array.from({ length: 7 }).map((_, index) => {
        const date = moment(start).add(adj, 'week').add(index, 'day');

        return {
          weekday: date.format('ddd'),
          date: date.toDate(),
        };
      });
    });
  }, [week]);

  async function fetchEvents() {
    try {
      const response = await api.get(`/event/user/${userId}`);
      const data = response.data
      setTitle(data.title)
      setDescription(data.description)
      setLocal(data.location)
      const d = new Date(data.event_date);
      const hours = d.getUTCHours();
      const minutes = d.getUTCMinutes();
      const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      setTime(formattedTime);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
  async function deleteEvent(id) {
    try {
      const response = await api.delete(`/event/${id}`);
      const data = response.data
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Header title='Agenda' />
      <View style={styles.container}>
        <View style={styles.picker}>
          <Swiper
            index={1}
            ref={swiper}
            loop={false}
            showsPagination={false}
            onIndexChanged={ind => {
              if (ind === 1) {
                return;
              }
              const newIndex = ind - 1;
              const newWeek = week + newIndex;
              setWeek(newWeek);
              setValue(moment(value).add(newIndex, 'week').toDate());
              setTimeout(() => {
                swiper.current.scrollTo(1, false);
              }, 100);
            }}>
            {weeks.map((dates, index) => (
              <View style={styles.itemRow} key={index}>
                {dates.map((item, dateIndex) => {
                  const isActive =
                    value.toDateString() === item.date.toDateString();
                  return (
                    <TouchableWithoutFeedback
                      key={dateIndex}
                      onPress={() => {
                        setValue(item.date)
                        fetchEvents()
                      }}>
                      <View
                        style={[
                          styles.item,
                          isActive && {
                            backgroundColor: '#111',
                            borderColor: '#111',
                          },
                        ]}>
                        <Text
                          style={[
                            styles.itemWeekday,
                            isActive && { color: '#fff' },
                          ]}>
                          {item.weekday}
                        </Text>
                        <Text
                          style={[
                            styles.itemDate,
                            isActive && { color: '#fff' },
                          ]}>
                          {item.date.getDate()}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                })}
              </View>
            ))}
          </Swiper>
        </View>


        <Text style={styles.subtitle}>{format(new Date(value), "PPP", { locale: pt })}</Text>

        <View style={styles.block}>
          <View>
            <Text style={styles.label}>Atividade</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={(val) => setTitle(val)}
              />
              <FontAwesome name='user' size={15} style={styles.inputIcon} />
            </View>
          </View>
          <View>
            <Text style={styles.label}>Descrição</Text>
            <View style={styles.inputBox}>
              <TextInput style={{
                borderBottomWidth: 0.5,
                borderBottomColor: "gray",
                width: '100%',
                maxHeight: 180,
                paddingRight: 20
              }}
                value={description}
                onChangeText={(val) => setDescription(val)}
                multiline textAlignVertical='top' />
              <FontAwesome name='list' size={15} style={styles.inputIcon} />
            </View>
          </View>
          <View>
            <Text style={styles.label}>Local</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                value={local}
                onChangeText={(val) => setDescription(val)}
              />
              <Entypo name='location-pin' size={20} style={styles.inputIcon} />
            </View>
          </View>
          <View>
            <Text style={styles.label}>Horário</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                value={time}
                onChangeText={(val) => setTime(val)}
              />
              <FontAwesome6 name='clock' size={15} style={styles.inputIcon} />
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <ButtonAction icon={'trash'} action={deleteEvent} />
            <ButtonAction icon={'plus'} />
            <ButtonAction text={'Salvar'} />

          </View>


        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    marginVertical: 100,
    marginHorizontal: 15,
    gap: 15,

  },
  header: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  picker: {
    flex: 1,
    maxHeight: 74,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#999999',
    marginBottom: 12,
  },
  footer: {
    marginTop: 'auto',
    paddingHorizontal: 16,
  },
  /** Item */
  item: {
    flex: 1,
    height: 50,
    marginHorizontal: 4,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#e3e3e3',
    flexDirection: 'column',
    alignItems: 'center',
  },
  itemRow: {
    width: width,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  itemWeekday: {
    fontSize: 13,
    fontWeight: '500',
    color: '#737373',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  /** Placeholder */
  placeholder: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    height: 400,
    marginTop: 0,
    padding: 0,
    backgroundColor: 'transparent',
  },
  placeholderInset: {
    borderWidth: 4,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 9,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },

  block: {
    backgroundColor: '#EAEAEA',
    width: '100%',
    padding: 20,
    borderRadius: 24,
    flexDirection: 'col',
    gap: 15,

  },
  title: {
    fontFamily: 'Montserrat-BoldItalic',
    color: 'black',
    fontSize: 20,
  },
  subtitle: {
    fontFamily: 'Montserrat-Italic',
    color: 'black',
    fontSize: 15,
    textAlign: 'center'
  },
  label: {
    fontFamily: "Montserrat-Italic",
    color: "gray",
    fontSize: 12,
  },
  textInput: {
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
    minheight: 40,
    width: '100%',
    maxHeight: 180,
    paddingRight: 20
  },
  inputBox: {
    justifyContent: 'center'
  },
  inputIcon: {
    position: 'absolute',
    alignSelf: 'flex-end',

  }
});