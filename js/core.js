$runner = null;

Math.seed = function(s) {
    return function() {
        s = Math.sin(s) * 10000; return s - Math.floor(s);
    };
};

$(function() {

  $runner = $("#runner");
  detailed = false;

  $(".config").each(function() {
    var $this = $(this);

    var value = getUrlParameter($this.attr("id"));
    if(typeof value !== typeof undefined) {
      $this.val(parseFloat(value));
      $this.trigger("change");
    }
  });

  $(".config").on("propertychange change click keyup input paste", function() {
    var $this = $(this);
    var id = $this.attr("id");
    setUrlParameter(id, $this.val());
  });

  $("#chance").on("propertychange change click keyup input paste", function() {
    var $this = $(this);
    document.getElementById("chanceRange").value = $this.val();
  });

  $("#chance").hover(function() {
    $(this).focus();
  }, function() {
    $(this).blur();
  }).on("mousewheel", function(event) {
    event.preventDefault();
    
    var $this = $(this);
    var $inc = parseFloat($this.attr('step'));
    var $max = parseFloat($this.attr('max'));
    var $min = parseFloat($this.attr('min'));
    var $currVal = parseFloat($this.val());

    // If blank, assume value of 0
    if (isNaN($currVal)) {
      $currVal = 0.0;
    }

    // Increment or decrement numeric based on scroll distance
    if (event.deltaFactor * event.deltaY > 0) {
      if (isNaN($max) || $currVal + $inc <= $max) {
        $this.val(($currVal + $inc).toFixed(2));
      }
    } else {
      if (isNaN($min) || $currVal - $inc >= $min) {
        $this.val(($currVal - $inc).toFixed(2));
      }
    }
    $(this).trigger("change");
  });

});

function run() {
  Math.seed(Date.now());
  detailed = $('#detailed').prop('checked');

  reset();
  print("<h4 id='results'>Results:</h4>");

  var total = 0;
  var averages = {};
  
  var chance = parseFloat($("#chance").val());
  var players = $("#players").val();
  var amount = $("#amount").val();

  for (var p = 1; p <= players; p++) {
    var playerTotal = 0;
    print("", "all");
    print("Player " + p + " attempts for " + amount + " enhancements at "+ chance +"%", "all");

    for (var i = 1; i <= amount; i++) {
      print("", "all");
      print("Enhancement " + i, "all");

      var success = false;
      var attempts = 0;

      while(!success) {
        var roll = parseFloat(((Math.random() * 100.00) + 0.01).toFixed(2));
        success = roll <= chance;
        attempts++;
        print("Attempt "+ attempts +", Rolled: " + roll + " " + (success ? "success!" : "failed"), "all");
      }

      playerTotal += attempts;
      print("Got 'Enchancement "+ i +"' in "+ attempts +" attempts", "all");
    }

    var average = parseInt(playerTotal / amount);
    averages[p] = average;

    print("Total attempts "+ playerTotal +" ("+amount+"/"+playerTotal+", avg: "+average+" attempts for enhancement)", "all");
    total += playerTotal;
    print("", "all");
  }

  print("", "result");
  var avgTotal = 0;
  for (var p = 1; p <= players; p++) {
    avgTotal += averages[p];
  }

  var summary = "Average Total: " + avgTotal + " attempts";
  summary += "<br/>Average Enhancement Rate: " + (avgTotal/players).toFixed(2) + " attempts";
  if (detailed) print(summary);
  $runner.find("#results").parent().append("<div>"+ summary +"</div>__________________________________________________")
  print("Good luck!");
}

function reset() {
  $runner.empty();
}

function print(msg, type) {
  if ($runner == null) {
    $runner = $("#runner");
  }

  if (msg === "") {
    msg = "<br/>";
  }

  if (detailed || type == null || type == "result") {
    $runner.append("<div>" + msg + "</div>");
  }
}

function onChanceRangeChange() {
  var chance = document.getElementById("chanceRange").value;
  document.getElementById("chance").value = chance;
}

function setUrlParameter(paramName, paramValue, reload) {
  var url = window.location.href;
  var hash = location.hash;
  url = url.replace(hash, '');
  if (url.indexOf("?") >= 0) {
    var params = url.substring(url.indexOf("?") + 1).split("&");
    var paramFound = false;
    params.forEach(function(param, index) {
      var p = param.split("=");
      if (p[0] == paramName) {
        params[index] = paramName + "=" + paramValue;
        paramFound = true;
      }
    });
    if (!paramFound) params.push(paramName + "=" + paramValue);
    url = url.substring(0, url.indexOf("?")+1) + params.join("&");
  } else {
    url += "?" + paramName + "=" + paramValue;
  }

  if(!reload) {
    window.history.pushState("object or string", "Bonfyre's Worker Roll Counter", url + hash);
  } else {
    window.location.href = url + hash;
  }
}

function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName, i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
};

function get(map, key) {
  return map[key][key];
}

function newMap(array) {
  var hash = Object.create(null);
  array.forEach(function (object) {
    hash[Object.keys(object)[0]] = object;
  });
  return hash;
}
