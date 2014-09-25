"세월호는 왜"
=============

소개
----

<img src="http://taogi.net/special/sewolho/background/images/og.jpg">

* <http://taogi.net/special/sewolho/background>

2014.4.16 세월호 참사가 일어난 구조적 원인을 타임라인으로 구성했습니다.
세월호 참사의 구조적 원인을 총 4개의 chapter로 나누었습니다.

1. 선박산업의 보호와 육성을 빌미로 선박연령 규제를 20년에서 30년으로 늘리는 등, 일련의 선박관련 규제가 완화되면서 국내 연안에 중고선박의 갯수가 급증합니다. 그 중 하나의 배가 세월호입니다.

2. 청해진 해운은 중고선박 도입후 불법 증축을 합니다. 이를 관리감독할 해양수산부 산화 기관들. 즉 한국선급, 해양경창, 인천항만청등이 아무런 역할을 하지 못하거나 오히려 눈감아줍니다. 결국 바다에 떠서는 안될 배. 세월호가 운항을 시작합니다.

3. 선박연령을 30년까지 늘리는 조건은 바로 일상적인 선박관리의 강화였습니다. 하지만 이런 선박검사 그리고 불법관적 단속은 이루어지지 않았습니다. 그리고 해양수산부와 해양경찰의 재난시 구난 훈련은 형식화되었습니다. 한편 국회는 국난구조에 있어 민관합동 모델을 추구한다며 국난구조법을 개조해 구난구조를 상당부분 민간에 위탁하려 했습니다. 그렇게 탄생한 것이 한국해양구조협회이지만, 오히려 국가의 구난구조 능력만 사라지는 결과를 만들었습니다.

4. 2014.4.16 오전 8시 58분경 세월호는 동력을 잃고 진도 울돌목에서 표류하기 시작한지 2시간만에 완전 침몰하였습니다. 선원들과 구조에 나선 해경과 정부의 제대로된 대처만 있었어도 거의 대부분의 아이들과 시민들은 구조될 수 있었습니다. 그러나 구조를 위한 골든타임을 완전히 놓치며 대한민국도 함께 침몰했습니다.

이 프로젝트에는 개발에 필요한 프로그램 소스는 물론 내용이 모두 포함되어 있습니다. 아무나 배포및 수정배포가 가능합니다.


제작진
------

'세월호는 왜' 는 '[진보네트워크센터][jinbonetwork]'와 '[투명사회를 위한 정보공개센터][opengirok]' 두 단체가 연대하여 만들어졌습니다.
* 콘텐츠 기획: 정보공개센터 강성국
* 디자인: 진보네트워크센터 뎡야핑
* 프로그램: 진보네트워크센터 황규만


기술 설명(Document)
===================

1.  사용된 jquery plugin 오픈소스
--------------------------------

세월호는 왜는 PHP 5.2와 jquery로 동작하며, 외부 라이브러리들을 일부 사용하고 있습니다. 사용 중인 라이브러리들의 목록과 라이선스, 저장 위치는 다음과 같습니다.

| 라이브러리                                            | 라이선스                               | 디렉토리                                          |
|-------------------------------------------------------|----------------------------------------|---------------------------------------------------|
| [BookBlock][repository-bookblock]                     | [Codrops][license-codrops]             | fsbb/BookBlock                                    |
| [perfect-scrollbar][repository-perfect-scrollbar]     | [MIT][license-mit]                     | fsbb/perfect-scrollbar                            |
| [actual][repository-actual]                           | [Copyright 2011, Ben Lin][license-lin] | contrib/jquery.actual                             |

2.  브라우져 지원
-----------------

'세월호는 왜' 프로젝트는 IE8 및 이하 버젼 IE 브라어져를 지원하지 않습니다. HTML5 를 지원하는 브라우져에서만 정상동작합니다.

3. 소스 설명
------------

1.  four-slide-book-block
    * 폴더: fsbb
    * BlockBlock은 각 chapter별 내용을 책처럼 넘길수 있는 인터페이스를 제공합니다.
    * four-slide-book-block은 기존의 오픈소스인 BookBlock 인터페이스에 4개의 슬라이드 모드로 서로 전환할 수 있도록 만들어진 jquery plugin 입니다.
    * 전체 콘텐츠를 4개의 chapter로 나누고 기본 모드를 4 Chapter에 대한 간략한 설명이 담긴 표지 역할을 합니다.
    * 동시에 각 chapter중에 서로 연관 있는 내용들을 4개의 슬라이드 화면에서 한꺼번에 볼 수 있도록 지원합니다.
    * four-slide 보드와 bookblock 모드로 자유롭게 오갈 수 있도록 만들어졌습니다.
    * 각 모드별로 auto-scroll 문제를 해결하기 위해 또 다른 jquery plugin perfect-scrollbar를 사용합니다.
    * 이 소스는 출처와 라이센스만 명시한다면 누구나 재배포, 수정배포가 가능합니다.
    * 상세한 메뉴얼을 하단 5번에서
    * License: MIT License

2.  jquery.sewol-timeline.js
    * 폴더: js/jquery.sewol-timeline.js, css/sewol.timeline.css
    * 각 chapter는 타임라인 형식으로 구성되어 있습니다. 이 각각의 타임라인들을 실제로 콘트롤하는 jquery plugin 입니다.
    * 이 소스 역시 출처와 라이센스만 명시한다면 누구나 배포, 재수정 배포할 수 있습니다.
    * 상세한 메뉴얼을 하단 6번에서
    * License: MIT License

3.  marsa.php
    * 폴더: marsa.php
    * '한국해양구조협회'에 참여하고 있는 정부부처와 기관들의 관계도를 페이지입니다.

4.  jquery.marsa-diagram.js
    * 폴더: js/jquery.marsa-diagram.js, css/marsa.diagram.css
    * jquery.marsa-diagram은 marsa.php에 있는 관계도를 responsive 하게 보여주기 위해 만들어진 jquery plugin 입니다.
    * 이 소스는 '한국해양구조협회'에 특화되어 있어 범용성이 없지만, 누구나 가져다 범용적으로 개조하여 출처표기 없이 새로 배포할 수 있습니다.
    
5.  app.js
    * 폴더: js/app.js
    * 위에서 설명한 3개의 jquery plugin들을 실제로 적용하는 javascript 입니다.
    * 가장 중요한 역할은 각 타임라인이나 '한국해양구조협회' 관계도에 등장하는 정부부처, 기관들이 저희가 구분한 4개의 chapter 영역에서 구체적으로 어떤 연관이 있는지 한번에 보여주는 기능입니다.
    * 하단 footer의 메뉴들에 대한 동작을 콘트롤합니다.
 
6.  layout.css
    * 폴더: css/layout.css
    * '세월호는 왜' 사이트의 기본 레이아웃과 하단 footer의 버튼에 대한 디자인입니다.

7.  style.css
    * 폴더: css/style.css
    * 전체 콘텐츠와 요소들에 대한 스타일시트입니다.
 
8.  icomoon
    * 폴더: css/fonts
    * 이 사이트에서 사용하는 이미지 폰트입니다. 주로 정부부처와 기관의 아이콘을 표시하기 위해 만들어졌습니다. 이 font는 icomoon 사이트의 무료 서비스를 이용하여 만들었습니다.

4. 타임라인 데이터
------------------

*  폴더: data/timeline.json
*  json 형태로 만들어졌습니다. 기본 json 포멧은 진보넷의 프로젝트인 '[따오기][repository-taogi]'의 기본 데이터 Json 포멧을 계승합니다.
*  내용을 수정하고 싶으신 분은 이 파일을 수정하시면 됩니다.
*  data/timeline.json 내용은 [정보공유라이선스 2.0: 영리금지 http://freeuse.or.kr/htm/main1_32.htm][license-freeuse] 라이선스를 따릅니다.

5.  four-slide-book-block 사용법
-------------------------------

*  기본 사용법: $('element').fsbb(options);
   *  옵션

      ```
      {
         mode: 'cover(표지모드) / quart(전체보기)',
         theme: 'sewol' (테마),
         tearse_speed : '1s' (transition animate speed),
         title: ''(표지 타이틀 element),
         title_pos: {'left' : 0(표지 타이틀 left position), 'top' : 0(표지 타이틀 top position) },
         background: ''(바탕 이미지),
         useCoverAniate: true(표지모드일때 animate 활성 옵션),
         bb_before: function(page) {} (four slide mode에서 bookblock 모드로 전환될때 onBefore Event function. argument: 활성화되는 chapter번호 1~4),
         bb_after: function(page) {} (four slide mode에서 bookblock 모드로 전환될때 onAfter Event function. argument: 활성화되는 chapter번호 1~4)
      }
      ```

*  method
   *  init(options)
      * $('element').fsbb('init',{options});
      * 위 기본 옵션과 동일
      * 주로 중간에 options 을 변경할때 사용.
   *  bb_activate(options)
      * $('element').fsbb('bb_activate',{options});
      * Chapter(options.chapter)를 bookblock 모드로 전환시킨다.
      * 옵션

        ```
        {
            chapter: 1(활성화되는 chapter 번호 1~4),
            bookblock_after: function() {} (bookblock 모드로 전환된후 afterEvent)
        }
        ```

6.  jquery.sewol-timeline.js 사용법
-----------------------------------

*  기본 사용법: $('element').sewoltm(options);
   *  옵션

      ```
      {
         theme: 'sewol' (테마),
         mode: 'full(전체화면 사용. 상세내용 보기를 오른쪽으로) / overlay(부분화면 사용. 상세 내용보기를 overlay형태로 보기)',
         tag: ''(특정 tag를 가지고 있는  타임라인 항목만 보여줌),
         showContentAnimate: 'opacity'(타임라인의 상세내용을 보여줄때 활용할 animation effect. default: opacity),
         eventHandle : 'true'(타임라인의 event handler(click/hover etc..) 를 활성화할지 여부),
         onBefore: function() {}(타임라인의 활성화되기 전 beforeEvent),
         onShowContent: function() {}(타임라인의 개별 항목이 상세보기할때 beforeEvent)
      }
      ```

*  method
   *  init(options)
      * $('element').sewoltm('init',{options});
      * 위 기본 옵션과 동일
      * 주로 중간에 options 을 변경할때 사용.
   *  activeElement(idx)
      * $('element').sewoltm('activeElement',i);
      * 타임라인의 idx번째 항목을 활성화시킨다.
   *  showContent(idx)
      * $('element').sewoltm('activeElement',i,j);
      * 타임라인의 i번째 항목의 j번째 내용을 보여준다.
   *  stop()
      * $('element').sewoltm('stop');
      * 타임라인의 Event(click,hover,resize etc..)를 비활성화시킨다.
   *  start()
      * $('element').sewoltm('start',{options});
      * 타임라인의 Event(click,hover,resize etc..)를 재활성화시킨다.


[jinbonetwork]: http://www.jinbo.net
[opengirok]: http://www.opengirok.or.kr
[repository-taogi]: https://github.com/jinbonet/taogi-timeline
[repository-bookblock]: https://github.com/codrops/BookBlock
[repository-perfect-scrollbar]: https://github.com/noraesae/perfect-scrollbar
[repository-actual]: https://github.com/dreamerslab/jquery.actual
[license-mit]: http://opensource.org/licenses/MIT
[license-codrops]: http://tympanus.net/codrops/licensing/
[license-lin]: http://dreamerslab.com/
[license-freeuse]: http://freeuse.or.kr/htm/main1_32.htm

Version History
---------------

* v.1.0 -- Initial release
