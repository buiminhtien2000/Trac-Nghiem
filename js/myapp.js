var app = angular.module("myApp",["ngRoute"]);
app.controller("subjectCtrl",function($scope,$http){
	$scope.list_subject = [];
	$http.get('db/Subjects.js').then(function(reponse){
		$scope.list_subject = reponse.data;
	});
	$scope.begin = 0;
	$scope.numPage=1;
	$scope.pageCount = Math.ceil($scope.list_subject.length /2);
	$scope.next = function(){
		if($scope.numPage<2){
			$scope.numPage++;
			return $scope.begin += 9;
		}else{
			return false;
		}
			
	}
	$scope.prev = function(){
		if($scope.numPage>1){
			$scope.numPage--;
			return $scope.begin -= 9;
		}else{
			return false;
		}
			
	}
});
/*--------chưa xong local----------*/
app.controller("studentCtrl",function($scope,$http,$rootScope){
	$scope.list_student = [];
	$http.get('db/Students.js').then(function(rep){
		$scope.list_student = rep.data;
	})
	$scope.errLogin="";
	$scope.login = function(){
		$rootScope.loginUser = [];
		if(localStorage.getItem('student-list')){
			$rootScope.loginUser = angular.fromJson(localStorage.getItem('student-list'));
			console.log($scope.datas)
		}
		if(localStorage.getItem('register-list')){
			$rootScope.registerUser = angular.fromJson(localStorage.getItem('register-list'));
			for(var i = 0;i<$rootScope.registerUser.length;i++){
				if($scope.taiKhoan == $rootScope.registerUser[i].username && $scope.matKhau == $rootScope.registerUser[i].password){
					document.getElementById('cancelLog').click();
					$scope.student = $rootScope.registerUser[i];
					$rootScope.loginUser.push($scope.student);
					$scope.student= null;
					localStorage.setItem('student-list',angular.toJson($rootScope.loginUser));
					location.reload();
					break;
				}else{
					$scope.errLogin="Tài Khoản hoặc Mật Khẩu sai!";
				}
			}
		}
		console.log($rootScope.registerUser)
		for(var i = 0;i<$scope.list_student.length;i++){
			if($scope.taiKhoan == $scope.list_student[i].username && $scope.matKhau == $scope.list_student[i].password){
				document.getElementById('cancelLog').click();
				$scope.student = $scope.list_student[i];
				$rootScope.loginUser.push($scope.student);
				$scope.student= null;
				localStorage.setItem('student-list',angular.toJson($rootScope.loginUser));
				location.reload();
				break;
			}else{
				$scope.errLogin="Tài Khoản hoặc Mật Khẩu sai!";
			}
		}
	}
	$scope.errRegister="";
	$scope.checkUser = function(){
		for(var i = 0;i<$scope.list_student.length;i++){
			if($scope.reg.username == $scope.list_student[i].username){
				$scope.errRegister="Tài Khoản Đã Tồn Tại";
				break;
			}else{
				$scope.errRegister="";
			}
		}
		for(var i = 0;i<$rootScope.registerUser.length;i++){
			if($scope.reg.username ==$rootScope.registerUser[i].username){
				$scope.errRegister="Tài Khoản Đã Tồn Tại";
				break;
			}else{
				$scope.errRegister="";
			}
		}
	}
	$scope.loadStudent = function(){
	  		$scope.dispMenus = false;
	  		if(localStorage.getItem('student-list')){
	  			$scope.dispMenus = true;
	  		}
	}
	$scope.register = function(){
		$rootScope.registerUser = [];
		console.log($scope.reg)
		if(localStorage.getItem('register-list')){
			$rootScope.registerUser = angular.fromJson(localStorage.getItem('register-list'));
		}
		$scope.registerUser.push($scope.reg);
		$scope.reg= null;
		localStorage.setItem('register-list',angular.toJson($scope.registerUser));
		document.getElementById('cancelreg').click();
	}
	$scope.logout = function(){
		localStorage.removeItem('student-list');
		location.reload();
	}
});
app.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "list_subject.html"
  })
  .when("/quiz/:id/:name", {
    templateUrl : "quiz.html"
  })
  .when("/mark", {
    templateUrl : "mark.html"
  })
});

app.controller("quizCtrl",function($scope,quizFactory,$timeout,$routeParams,$rootScope){
	$scope.start = function(){
			if(!localStorage.getItem('student-list')){
	  			document.getElementById('dispLogin').click();
	  		}else{
				$scope.subjectName = $routeParams.name;
	            $scope.count = 1;
	            $scope.quizOver = false;
	            $scope.inProgess = true;
	            $scope.disStar = false;
	            $scope.getQuestion();
	            $scope.coundown();
        	}
        };
        $scope.reset = function(){
            $scope.inProgess = false;
            $scope.score = 0;
        };
        $scope.getQuestion = function(){
           var quiz = quizFactory.getQuestion();
           if(quiz){
            $scope.question = quiz.Text;
            $scope.options = quiz.Answers;
            $scope.answer = quiz.AnswerId;
            $scope.answerMode = true;
           } else{
            $scope.quizOver = true;
           }      
        }
        $scope.checkAnswer = function(){
	        if(!$("input[name = answer]:checked").length){
	             return ;
	        };
	        var ans = $("input[name = answer]:checked").val();
			if(ans == $scope.answer){
			   	$scope.score++;
			   	console.log($scope.score)
			}
		}
	    $scope.nextQuestion = function(){
	        $scope.id++;
	        $scope.count++;
	        if($scope.count < 10){
		        $scope.checkAnswer();
		        $scope.getQuestion();
		        $scope.prevMode = true;
	        }else{
	         $scope.answerMode = false;
	        }
	    }
	    $scope.prevQuestion = function(){
	        $scope.id--;
	        $scope.count--;
	        if($scope.count > 1&&$scope.count < 10){
		        $scope.checkAnswer();
		        $scope.getQuestion();
	        }else{
	        	$scope.prevMode = false;
	        }
	    }
	    $scope.m = 1;var stoped;$scope.s=0;$scope.disp;$scope.disScore=false;$scope.disStar=true;
	    $scope.coundown = function(){
	    	stoped = $timeout(function(){
	    		$scope.s--;
	    		$scope.coundown();
	    	},1000)
			if ($scope.s === -1){
		        $scope.m -= 1;
		        $scope.s = 59;
		    }
		    if($scope.s < 10){
		        $scope.disps=0;
		    }else{
		        $scope.disps="";
		    }
		    if($scope.m < 10){
		        $scope.dispm=0;
		    }else{
		        $scope.dispm="";
		    }
		    if($scope.s === 0 && $scope.m === 0){
	    		$scope.stop();
	    		$scope.finish();
	    	}
	    	
	  	};
	  	/*--------------display mark------------------------*/
	  	$scope.finish = function(){
	  		$scope.disScore=true;
	    	$scope.inProgess=false;
	    	$scope.kq=true;
	    	if($scope.score < 5){
	    		$scope.kq=false;
	    	}
	    	$scope.infoStudent=[];
	    	if(localStorage.getItem('info-student')){
				$scope.infoStudent = angular.fromJson(localStorage.getItem('info-student'));
				console.log($scope.infoStudent)
			}
			$scope.dataStudent = {};
			$scope.dataStudent.name = $rootScope.loginUser[0].fullname;
			$scope.dataStudent.username = $rootScope.loginUser[0].username;
			$scope.dataStudent.marks = $scope.score;
			$scope.dataStudent.subject = $scope.subjectName;
	    	$scope.infoStudent.push($scope.dataStudent);
			localStorage.setItem('info-student',angular.toJson($scope.infoStudent));
	  	}
	  	$scope.loadData = function(){
	  		$scope.dispMenus = false;
	  		if(localStorage.getItem('student-list')){
	  			$rootScope.loginUser = angular.fromJson(localStorage.getItem('student-list'));
	  			$scope.dispMenus = true;
	  		}
	  		if(localStorage.getItem('info-student')){
				$scope.infoStudent = angular.fromJson(localStorage.getItem('info-student'));
				console.log($scope.infoStudent)
			}
	  	}
	  	$scope.stop = function(){
	  		$timeout.cancel(stoped);
	  	}
	    $scope.reset();
})
app.factory('quizFactory',function($http,$routeParams){
	$http.get('db/Quizs/'+$routeParams.id+'.js').then(function(rep){
		questions = rep.data;
	});
	return{
		getQuestion:function(){
			var randomItiem = questions[Math.floor(Math.random()*questions.length)];
			return randomItiem;
		}

	}
});
